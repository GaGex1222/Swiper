import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

interface CustomAlertDialogProps {
  isVisible: boolean;
  onClose: () => void; // For 'Not Now' or simple dismiss
}

const PermissionRequiredModal: React.FC<CustomAlertDialogProps> = ({
  isVisible,
  onClose,
}) => {
    const onConfirm = () => {
        onClose()
        Linking.openSettings()
    }
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose} // Handles Android back button
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>Permission Required</Text>
          <Text style={modalStyles.modalText}>We need full access to your photo library to let you swipe and clean your gallery. Please grant access.</Text>
          
          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity style={modalStyles.buttonClose} onPress={onClose}>
              <Text style={modalStyles.buttonCloseText}>Not Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.buttonConfirm} onPress={onConfirm}>
                <Text style={modalStyles.buttonConfirmText}>Open Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark semi-transparent overlay
  },
  modalView: {
    margin: 20,
    backgroundColor: '#1a2130', // Same as your screen background
    borderRadius: 12,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: '90%',
    width: 320, // Fixed width for a more alert-like appearance
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E0E0E0', // Light text for titles
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 15,
    color: '#B0B0B0', // Slightly dimmer text for body
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  buttonClose: {
    // Style for the 'Not Now' button
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    // No background color for a subtle look
  },
  buttonCloseText: {
    color: '#B0B0B0', // Subtler text color
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonConfirm: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#3b82f6', // Your existing button color
    marginLeft: 10, // Space between buttons
  },
  buttonConfirmText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PermissionRequiredModal;