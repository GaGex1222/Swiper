// src/utils/onboarding.ts
import * as SecureStore from 'expo-secure-store';

// Define the key used to track completion
const ONBOARDING_KEY = 'onboardingComplete';


export async function getOnboardingStatus(): Promise<boolean> {
  try {
    const status = await SecureStore.getItemAsync(ONBOARDING_KEY);
    return status === 'true';
  } catch (error) {
    console.error("Error fetching onboarding status from SecureStore:", error);
    return false;
  }
}

/**
 * Marks the onboarding process as complete.
 */
export async function setOnboardingComplete(): Promise<void> {
  try {
    // Set the value to the string 'true'
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.error("Error setting onboarding status in SecureStore:", error);
  }
}