import { Stack } from 'expo-router';

// This file defines the layout for all screens within the (utility) route group.
export default function UtilityLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="trash"/>
    </Stack>
  );
}
