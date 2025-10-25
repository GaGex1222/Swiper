import * as MediaLibrary from 'expo-media-library';
import { TrashItem } from './storageFunctions';

export async function handleGalleryAccess() {
  let { status: readStatus, accessPrivileges } = await MediaLibrary.requestPermissionsAsync(false, ['photo', 'video']);

  if (readStatus !== 'granted' || accessPrivileges !== "all") {
    console.log("Media Library read permission not granted.");
    return false;
  }

  const { status: writeStatus } = await MediaLibrary.requestPermissionsAsync(true);

  if (writeStatus !== 'granted') {
      console.log("Media Library write permission not granted.");
      return false
  }

  return true
}

export async function getRandomAsset(): Promise<MediaLibrary.Asset | null> {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
        console.error("Permission not granted to access media library.");
        return null;
    }

    const album = await MediaLibrary.getAssetsAsync({
        first: 0,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video], 
    });

    const totalCount = album.totalCount;
    if (totalCount === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * totalCount);
    const randomAssets = await MediaLibrary.getAssetsAsync({
        first: 1,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        after: randomIndex.toString(), 
    });

    return randomAssets.assets.length > 0 ? randomAssets.assets[0] : null;
}

export async function deleteAssets(assets: TrashItem[]) {
    try {
        const ids = assets.map((item) => {
            return item.id
        })
        await MediaLibrary.deleteAssetsAsync(ids)
    } catch (error){
        console.error("Error deleting assets from device: ", error)
    }
}