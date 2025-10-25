import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipableCard } from '@/components/SwipeableCard'; // Assuming the swipeable card component is imported
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';

export default function PlayTestScreen() {
  const router = useRouter()
  // NOTE: In a real application, this function would navigate the user
  // to the main app screen (e.g., using React Navigation's `navigation.navigate('Home')`).
  const handleContinue = () => {
    router.replace("/(utility)/trash")
  };

  return (
    <GestureHandlerRootView style={styles.fullScreen}>
      
      <View style={styles.textContainer}>
        <Text style={styles.tryItOutText}>Get Started with Swiper!</Text>
        <Text style={styles.instructionText}>
            Learn how to use your new gallery manager!
        </Text>
      </View>

      <View style={styles.cardWrapper}>
        <SwipableCard />
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.swipeInstructions}>
            Swipe <Text style={styles.trashAction}>left (←)</Text> to send it to temporary trash,
            and <Text style={styles.keepAction}>right (→)</Text> to keep it.
        </Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue to My Library</Text>
          <Feather name="arrow-right" size={24} color="#E0E0E0" />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#1a2130', 
  },


  textContainer: {
    paddingHorizontal: 24, 
    marginTop: 60, // Increased margin for better top spacing
  },

  tryItOutText: {
    fontSize: 28, // Larger title
    fontWeight: '900',
    color: '#3b82f6', 
    textAlign: 'center',
    marginBottom: 8,
  },
    
  instructionText: {
    fontSize: 18, // Larger and clearer introductory text
    color: '#d1d5db', 
    textAlign: 'center',
    lineHeight: 28,
  },
    
  // Card container styling
  cardWrapper: {
    flex: 1, // Takes up the majority of space
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20, // Vertical spacing for the card
  },

  // --- Footer/Button Styles ---
  footerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40, // Increased padding for better spacing from the bottom edge
    alignItems: 'center',
  },

  swipeInstructions: {
    fontSize: 15,
    color: '#9ca3af', // Gray text for subtle instructions
    textAlign: 'center',
    marginBottom: 20, // Space between instructions and button
    lineHeight: 22,
  },
    
  trashAction: {
    fontWeight: 'bold',
    color: '#EF4444', // Red color for the trash action
  },
    
  keepAction: {
    fontWeight: 'bold',
    color: '#10B981', // Green color for the keep action
  },

  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6', // Primary blue color
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E0E0', // Dark text on blue background
    marginRight: 10,
  },
});
