import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { useRouter } from 'expo-router';
// Assuming '@/assets/images/image_organazing.png' is the correct alias
const galleryIllustration = require('@/assets/images/swipe_organize.png'); 

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const handleNextPage = () => {
    router.replace('/(onboarding)/permission')
  }

  return (
    <View style={styles.fullScreen}> 
      
      <View style={styles.imageContainer}>
        <Image 
          source={galleryIllustration} 
          style={styles.illustrationImage} 
          resizeMode="contain"
        />
      </View>

      <View style={[
        styles.bottomContent, 
        { paddingBottom: insets.bottom + 50 } 
      ]}>
        <Text style={styles.mainTitle}>Welcome to Swipe!</Text>
        <Text style={styles.subtitle}>
          The simplest way to clear your gallery while rediscovering your best memories.
        </Text>

        <TouchableOpacity onPress={handleNextPage} style={styles.button}>
          <Text style={styles.buttonText}>Lets Swipe!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Global Layout
  fullScreen: {
    flex: 1,
    backgroundColor: '#1a2130', 
  },
  
  // Image Section Styles
  imageContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 20, 
    marginBottom: -50, // Negative margin to pull the image closer to text
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