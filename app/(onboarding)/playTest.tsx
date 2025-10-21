// קוד PlayTestScreen (חיצוני לקובץ ה-Canvas)

import React from 'react';
import { View, StyleSheet } from 'react-native';
// (ייבוא נדרש)
import { SwipableCard } from '@/components/SwipeableCard'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 

export default function PlayTestScreen() {
  // הסרנו את useSafeAreaInsets, useRouter, handleNextPage, והתמונה 
  // כדי למקד את המסך בכרטיס

  return (
    // עוטפים את המסך ב-GestureHandlerRootView עם צבע הרקע הנכון
    <GestureHandlerRootView style={styles.fullScreen}>
      <View style={styles.cardWrapper}>
        <SwipableCard />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // הגדרת הרקע הכללי
  fullScreen: {
    flex: 1,
    backgroundColor: '#1a2130', // הרקע של WelcomeScreen
  },
  // מיכל ממורכז לכרטיס
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
