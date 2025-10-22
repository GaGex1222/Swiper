import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';
// ייבוא מודרני מ-gesture-handler
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    interpolateColor,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useVideoPlayer, VideoSource, VideoView } from 'expo-video';
import { Image } from 'expo-image';

import { getRandomAsset } from '@/utils/mediaFunctions';
import { Asset } from 'expo-media-library';


// --- Type Definitions ---
interface Item {
    id: number;
    color: string;
    text: string;
}


// --- Constants ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH: number = SCREEN_WIDTH * 0.85; 
const CARD_HEIGHT: number = CARD_WIDTH * 1.60;
const SWIPE_THRESHOLD: number = CARD_WIDTH * 0.35;
const SPRING_CONFIG = { damping: 20, stiffness: 150, mass: 1 };


/**
 * --- Swipable Card Component (Modern Reanimated API) ---
 */
export const SwipableCard: React.FC = () => { // Component now receives no props
    const [currentAsset, setCurrentAsset] = useState<Asset>()
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const player = useVideoPlayer(currentAsset?.uri as VideoSource, player => {
        player.loop = true;
        player.play();
    });

    
    useEffect(() => {
        const loadInitialAsset = async () => {
            const asset = await getRandomAsset()
            if (asset) {
                setCurrentAsset(asset);
            }
        };

        loadInitialAsset();
    }, [])

    // Placeholder function for swipe end. Logs the action and resets the card position.
    const handleTestSwipeEnd = useCallback(async (direction: 'left' | 'right') => {
        const newAsset = await getRandomAsset();
        if (newAsset) {
            setCurrentAsset(newAsset);
        }
        // Reset the card position and load the next image
        translateX.value = 0;
        translateY.value = 0;
    }, [translateX, translateY]); 

    // --- Gesture Definition using the modern API (Gesture.Pan) ---
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            // ONLY update horizontal position
            translateX.value = event.translationX;
            // Vertical movement is RESTRICTED (translationY is kept at 0)
        })
        .onEnd((event) => {
            // Check if the swipe threshold was met horizontally
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                const direction: 'left' | 'right' = event.translationX > 0 ? 'right' : 'left';
                const targetX: number = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;

                // Animate off-screen horizontally, then run JS function to log and reset
                translateX.value = withSpring(targetX, SPRING_CONFIG, () => {
                    runOnJS(handleTestSwipeEnd)(direction);
                });
            } else {
                // Snap back to the center horizontally
                translateX.value = withSpring(0, SPRING_CONFIG);
            }
        });

    // Animated styles for the card movement, rotation, and custom drained effect
    const cardStyle = useAnimatedStyle(() => {
        const rotateZ = interpolate(
            translateX.value,
            [-CARD_WIDTH, CARD_WIDTH],
            [-10, 10], 
            Extrapolate.CLAMP
        );

        // --- DRAINED EFFECT FOR LEFT SWIPE (Scale/Opacity) ---
        // Scale down to 0.9 when dragging left (delete)
        const scaleFactor = interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
            [0.9, 1, 1], 
            Extrapolate.CLAMP
        );
        
        // Opacity down to 0.7 when dragging left (delete)
        const opacityFactor = interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD, 0],
            [0.7, 1], 
            Extrapolate.CLAMP
        );
        
        // --- DYNAMIC BORDER COLOR LOGIC ---
        const borderColor = interpolateColor(
            translateX.value,
            [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
            ['#EF4444', 'rgba(255, 255, 255, 0.1)', '#10B981'] // Red, Transparent White, Green
        );
        // --------------------------------------------------------

        return {
            opacity: opacityFactor,
            borderWidth: 4, // Make border visible
            borderColor: borderColor, // Apply dynamic color
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value }, // Always 0, restricting vertical movement
                { rotate: `${rotateZ}deg` },
                { scale: scaleFactor },
            ],
        };
    });
    
    // Animated styles for the "KEEP" indicator (Right Swipe)
    const keepStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [0, SWIPE_THRESHOLD / 2],
            [0, 1],
            Extrapolate.CLAMP
        );
        return { opacity };
    });


return (
    <GestureHandlerRootView style={styles.fullSizeContainer}>
        <View style={styles.cardWrapper}>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.cardContainer, cardStyle]}>
                    
                    {currentAsset?.mediaType === 'video' && currentAsset?.uri ?  (
                        <VideoView 
                            player={player} 
                            allowsPictureInPicture
                            style={{ flex: 1, width: '100%', height: '100%', }}
                            contentFit='cover'
                        />
                    ) : currentAsset?.mediaType === 'photo' && currentAsset?.uri ? (
                        // Show image if type is 'image' and URI is present
                        <Image 
                            source={{ uri: currentAsset.uri }} 
                            style={styles.cardImage} 
                            contentFit="fill" // or "contain", "fill", "none", "scale-down"
                        />
                    ) : (
                        // Fallback placeholder
                        <View style={styles.loadingPlaceholder}>
                            <Text style={styles.loadingText}>Loading Asset...</Text>
                        </View>
                    )}

                </Animated.View>
            </GestureDetector>
        </View>
    </GestureHandlerRootView>
);

};

/**
 * --- Main App Component (Default Export) ---
 * Simplified to render a single, prop-less SwipableCard for testing.
 */
export default function App() {
    // Message updated to reflect the horizontal-only constraint and center positioning
    const [message] = useState<string>('Card centered. Horizontal swipe ONLY is enforced. Vertical drag is disabled. Watch the border color change!');

    return (
        
        <View style={styles.appContainer}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.title}>Dynamic Border Swiper Test</Text>
            <View style={styles.cardStack}>
                
                {/* Render a single, self-contained SwipableCard */}
                <Animated.View 
                    key={"test-card"} 
                    // Simplified style to just center the card
                    style={[styles.stackPosition, {zIndex: 100, opacity: 1, transform: [{ scale: 1 }, { translateY: 0 }]}]}
                    pointerEvents={'auto'} 
                >
                    <SwipableCard /> 
                </Animated.View>

            </View>
            <Text style={styles.messageText}>{message}</Text>
        </View>
    );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#1f2937', 
        alignItems: 'center',
        justifyContent: 'center', // Changed to center content vertically
    },
    fullSizeContainer: {
        flex: 1, 
        width: '100%', 
        height: '100%', 
        position: 'absolute'
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#f9fafb',
        // Reduced margin to make space for center alignment
        marginBottom: 20, 
    },
    cardStack: {
        // Use the majority of remaining space to center the card within
        flex: 1, 
        width: SCREEN_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stackPosition: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: CARD_WIDTH, // Use CARD_WIDTH for positioning
        height: CARD_HEIGHT,
    },
    contentText: {
        fontSize: 40,
        fontWeight: '900',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subText: {
        fontSize: 18,
        marginTop: 10,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    overlay: {
        position: 'absolute',
        padding: 12,
        borderRadius: 8,
        borderWidth: 4,
        top: 30,
        zIndex: 10, 
    },
    deleteOverlay: {
        left: 20,
        borderColor: '#EF4444', // Changed to match the dynamic border color
        transform: [{ rotate: '-15deg' }],
    },
    deleteText: {
        fontSize: 28,
        fontWeight: '800',
        color: '#EF4444', // Changed to match the dynamic border color
    },
    messageText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#9ca3af',
        marginVertical: 30,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    cardWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.1)', // fallback background
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 15,
        alignItems: 'center',
        justifyContent: 'center',
        // Removed fixed border styling here to let Animated.View manage it
    },

    cardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        position: 'absolute',
    },

    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingVertical: 30,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },

    loadingPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#374151', // A slightly darker gray for loading state
    },
    loadingText: {
        color: '#d1d5db',
        fontSize: 16,
    },

});
