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

export async function getRandomAsset(): Promise<MediaLibrary.Asset | null> {
    // 1. Ensure permissions are granted
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
        console.error("Permission not granted to access media library.");
        return null;
    }

    // --- Step 1: Get the Total Count ---
    // We use { first: 0 } to get only the total count without fetching actual data.
    const album = await MediaLibrary.getAssetsAsync({
        first: 0,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video], // Use 'photo' or 'video'
    });

    const totalCount = album.totalCount;
    if (totalCount === 0) {
        return null;
    }

    // --- Step 2: Calculate a Random Offset ---
    // The 'after' parameter is 0-indexed, so we pick a number between 0 and totalCount - 1.
    const randomIndex = Math.floor(Math.random() * totalCount);

    // --- Step 3: Fetch the Asset at the Random Index ---
    // We set first: 1 to fetch only the single asset at the calculated position.
    const randomAssets = await MediaLibrary.getAssetsAsync({
        first: 1,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        after: randomIndex.toString(), // The offset is passed as a string
    });

    return randomAssets.assets.length > 0 ? randomAssets.assets[0] : null;
}