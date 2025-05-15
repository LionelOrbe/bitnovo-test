import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ModalScreenProps {
  visible: boolean;
  onClose: () => void;
}

const ModalScreen: React.FC<ModalScreenProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={80} style={styles.blurContainer} >
        <View style={styles.modalContainer}>
        <Ionicons name="checkmark-circle" size={70} color='rgba(30, 214, 235, 1)' />
        <Text style={styles.title}>Solicitud enviada</Text>
          <Text style={styles.modalText}>Tu solicitud de pago ha sido enviada con éxito por WhatsApp.</Text>
          <TouchableOpacity onPress={onClose} style={styles.understoodButton}>
            <Text style={styles.understoodButtonText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 14, 95, 0.69)',    
    filter: 'blur(10)',
    
  },
  modalContainer: {
    width: '90%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }, 
  understoodButton: {   
    backgroundColor: '#007AFF',
    padding: 15,
    alignItems: 'center',
    width: '100%',    
    borderRadius: 8,
  },
  understoodButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }, 
});

export default ModalScreen;