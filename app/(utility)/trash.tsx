import { deleteTrashItems, getTrashItems, TrashItem } from '@/utils/storageFunctions';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_SIZE = SCREEN_WIDTH / 3 - 20;

export default function Trash() {
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load trash items on mount
  useEffect(() => {
    async function getInitialData() {
      try {
        const data: TrashItem[] = await getTrashItems();
        setTrashItems(data);
      } catch (e) {
        console.error('Error retrieving trash items:', e);
      } finally {
        setLoading(false);
      }
    }
    getInitialData();
  }, []);

  // Select/deselect a single item
  const toggleSelectItem = (id: string) => {
    console.log("ID", id)
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    );
  };

  // Select or deselect all
  const allSelected = selectedItems.length === trashItems.length && trashItems.length > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(trashItems.map((item) => item.id));
    }
  };

  const deleteSubmit = async () => {
    const success = await deleteTrashItems(selectedItems);
    if(!success) return
    
    setTrashItems((prev) => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  }

  return (
    <GestureHandlerRootView style={styles.fullScreen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Feather name="chevron-left" size={30} color="#f9fafb" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Trash ({trashItems.length})</Text>

        <TouchableOpacity style={styles.selectAllButton} onPress={handleSelectAll}>
          <Feather
            name={allSelected ? 'check-square' : 'square'} // icon changes
            size={28}
            color={allSelected ? '#3b82f6' : '#9ca3af'} // color changes
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#60a5fa" />
        </View>
      ) : trashItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="trash-2" size={60} color="#9ca3af" />
          <Text style={styles.emptyText}>
            Your trash is empty. Good job keeping things tidy!
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.listContent, { flexDirection: 'row', flexWrap: 'wrap' }]}
        >
          {trashItems.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            console.log(item.uri)
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleSelectItem(item.id)}
                style={[styles.assetContainer, isSelected && styles.selectedBorder]}
                activeOpacity={0.8}
              >
                <Image source={{ uri: item.uri }} style={styles.thumbnail} />

                {isSelected && (
                  <View style={styles.selectionOverlay}>
                    <Feather name="check-circle" size={22} color="#3b82f6" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Footer */}
      {trashItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.selectionInfo}>
            <Text style={styles.infoText}>
              {selectedItems.length} item
              {selectedItems.length !== 1 ? 's' : ''} selected
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.deleteButton,
              selectedItems.length === 0 && { opacity: 0.5 },
            ]}
            disabled={selectedItems.length === 0}
            onPress={deleteSubmit}
          >
            <Feather name="trash-2" size={20} color="#f9fafb" />
            <Text style={styles.deleteButtonText}>Delete Permanently</Text>
          </TouchableOpacity>
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#1a2130',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#1f2937',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f9fafb',
  },
  backButton: {
    padding: 5,
  },
  selectAllButton: {
    padding: 5,
  },
  selectAllText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 5,
    paddingBottom: 150,
  },
  assetContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#374151',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBorder: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectionOverlay: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 50,
    padding: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#9ca3af',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 15,
    backgroundColor: '#1f2937',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    alignItems: 'center',
  },
  selectionInfo: {
    marginBottom: 10,
  },
  infoText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginLeft: 10,
  },
});
