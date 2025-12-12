import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { MoonSenseColors } from '../constants/colors';

interface MoonEnergyPopupProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
}

const MoonEnergyPopup = ({ isVisible, onClose, message }: MoonEnergyPopupProps) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPressOut={onClose} // Close when tapping outside the popup
      >
        <View style={styles.popupContainer}>
          <Text style={styles.messageText}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: MoonSenseColors.MoonLavender,
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  messageText: {
    fontSize: 18,
    color: MoonSenseColors.NightGrey,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: MoonSenseColors.CosmicPurple,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  closeButtonText: {
    color: MoonSenseColors.MoonWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MoonEnergyPopup;
