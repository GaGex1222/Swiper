import * as MediaLibrary from 'expo-media-library';

export async function handleGalleryAccess() {
  // 1. Request Read Access Permission
  let { status: readStatus } = await MediaLibrary.requestPermissionsAsync(false, ['photo', 'video']);

  // On iOS, you typically need to check for the 'limited' status as well.
  if (readStatus !== 'granted') {
    // If permission isn't granted, we can't proceed.
    console.log("Media Library read permission not granted.");
    return false;
  }
  
  // 2. Request Write Access Permission (Optional, but often needed for deletion/saving)
  const { status: writeStatus } = await MediaLibrary.requestPermissionsAsync(true);

  if (writeStatus !== 'granted') {
      console.log("Media Library write permission not granted.");
      return false
  }

  return true
}