import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { deleteAssets } from './mediaFunctions';
//Onboarding functions to detect if user firs time or not 
export async function getOnboardingStatus(): Promise<boolean> {
  try {
    const status = await SecureStore.getItemAsync('onboardingComplete');
    return status === 'true';
  } catch (error) {
    console.error("Error fetching onboarding status from SecureStore:", error);
    return false;
  }
}


export async function setOnboardingComplete(): Promise<void> {
  try {
    await SecureStore.setItemAsync('onboardingComplete', 'true');
  } catch (error) {
    console.error("Error setting onboarding status in SecureStore:", error);
  }
}

export interface TrashItem {
  id: string,
  mediaType: "photo" | "video",
  uri: string
}

//Trash items
export async function getTrashItems(): Promise<TrashItem[]> {
  try {
    const jsonValue = await AsyncStorage.getItem("trash");

    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    } else {
      const emptyArray: TrashItem[] = [];
      await AsyncStorage.setItem("trash", JSON.stringify(emptyArray));
      return emptyArray;
    }
  } catch (error) {
    console.error("Error managing trash storage:", error);
    return []; 
  }
}

export async function addTrashItem(item: TrashItem) {
  try {
    const jsonValue = await AsyncStorage.getItem("trash");
    let currentItems = [];

    if (jsonValue !== null) {
      currentItems = JSON.parse(jsonValue);
    } 
    
    const newItems = [...currentItems, item]; 
    const newJsonValue = JSON.stringify(newItems);
    await AsyncStorage.setItem("trash", newJsonValue);
  } catch (error) {
    console.error("Error adding item to trash:", error);
  }
}

export async function deleteTrashItems(idsToDelete: string[]) {
  try {
    const jsonValue = await AsyncStorage.getItem("trash");

    if (jsonValue !== null) {
      const idsToDeleteSet = new Set(idsToDelete);

      const currentItems: TrashItem[] = JSON.parse(jsonValue);

      const itemsToPermanentDelete = currentItems.filter(item => 
        idsToDeleteSet.has(item.id) 
      );

      await deleteAssets(itemsToPermanentDelete);
      
      const updatedItems = currentItems.filter(item => {
        return !idsToDeleteSet.has(item.id); 
      });

      await AsyncStorage.setItem("trash", JSON.stringify(updatedItems));
      
      console.log(`Successfully deleted ${idsToDelete.length} items from trash.`);
    }
  } catch (error) {
    console.error("Error permanently deleting item from trash: ", error);
  }
}