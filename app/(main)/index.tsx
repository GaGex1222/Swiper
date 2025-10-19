import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getOnboardingStatus } from '@/utils/storageFunctions';
import { useRouter } from 'expo-router';

export default function MainAppScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
    useEffect(() => {
    async function checkOnboarding() {
      const status = await getOnboardingStatus();
      console.log('Onboarding status fetched:', status); 
      
      const route = status ? '/(app)' : '/(onboarding)/welcome';
      console.log(route)
      router.replace(route as any);
    }
    checkOnboarding();
  }, []); 
  return (
    // The View fills the screen and inherits the root layout's gradient background.
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      <StatusBar style="light" />
      
      <Text style={styles.mainTitle}>App Home</Text>
      
      <Text style={styles.subtitle}>
        Welcome back! This is the core of your application.
      </Text>
      
      {/* You can add your main app components here, like a list, cards, or a map. */}
      
      <View style={styles.contentBox}>
        <Text style={styles.boxText}>Start Organizing Your Gallery</Text>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    // Note: No need to set backgroundColor here, as it's transparent and inherits the gradient.
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text for contrast
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0', // Lighter gray for secondary text
    textAlign: 'center',
    marginBottom: 50,
    maxWidth: 300,
  },
  contentBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent box for content
    padding: 30,
    borderRadius: 15,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  boxText: {
    fontSize: 20,
    color: '#E0E0E0',
    fontWeight: '600',
  }
});