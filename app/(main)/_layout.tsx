import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ 
        headerShown: false, 
        contentStyle: { 
            backgroundColor: 'transparent', 
        },
        animation: 'slide_from_right' 
    }}>
      <Stack.Screen name="welcome" /> 
      <Stack.Screen name="screen2" /> 
      <Stack.Screen name="screen3" />
    </Stack>
  );
}

