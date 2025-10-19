import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { handleGalleryAccess } from '../../utils/accessFunctions';


const permissionIllustration = require('@/assets/images/swipe_files.png'); 

export default function PermissionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
    const handleAskForPermission = async () => {
        const isGranted = await handleGalleryAccess();
        
        if (isGranted) {
        console.log("Gallery permissions granted. Moving to next step.");
        router.replace('/(onboarding)/playTest'); 
        } else {
        // 3. If denied, inform the user they can't proceed
        console.log("Gallery permissions denied. Showing alert.");
        Alert.alert(
            "Permission Required", 
            "We need full access to your photo library to let you swipe and clean your gallery. Please grant access.",
            // Optionally add a button to open app settings
            [{ text: "OK" }] 
        );
        }
    };
  
  return (
    <View style={styles.fullScreen}> 
      
      <View style={styles.imageContainer}>
        <Image 
          source={permissionIllustration} 
          style={styles.illustrationImage} 
          resizeMode="contain"
        />
      </View>

      <View style={[
        styles.bottomContent, 
        // Adjust padding to ensure content is above the physical device safe area + extra margin
        { paddingBottom: insets.bottom + 50 } 
      ]}>
        
        {/* Title changed to reflect permission request */}
        <Text style={styles.mainTitle}>Access Your Photos</Text>
        
        {/* Subtitle explaining why permission is needed */}
        <Text style={styles.subtitle}>
          We need access to your photo library to let you swipe through your photos and free up storage. Your photos stay private.
        </Text>

        {/* Button to trigger the permission request logic */}
        <TouchableOpacity style={styles.button} onPress={handleAskForPermission}>
          <Text style={styles.buttonText}>Grant Photo Access</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Global Layout - Inherits gradient from RootLayout
  fullScreen: {
    flex: 1,
    // Note: backgroundColor is kept here for quick visual check, 
    // but should be removed in production to reveal the root gradient.
    backgroundColor: '#1a2130', 
  },
  
  // Image Section Styles
  imageContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 20, 
    marginBottom: -50, 
  },
  illustrationImage: {
    width: '100%', 
    height: '100%', 
    maxWidth: 400, 
    maxHeight: 400, 
  },

  // Bottom Content Section Styles
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24, 
  },
  
  // Text Styles
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0E0E0', 
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0', 
    textAlign: 'center',
    marginBottom: 40, 
    lineHeight: 24,
  },

  // Button Styles
  button: {
    backgroundColor: '#3b82f6', 
    paddingVertical: 16,
    paddingHorizontal: 60, 
    borderRadius: 12, 
    elevation: 5,
    shadowColor: '#3b82f6', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 6, 
    width: '100%', 
    maxWidth: 300, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});