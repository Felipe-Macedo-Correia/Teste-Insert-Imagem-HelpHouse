import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const Upload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Estado para armazenar a URL da imagem

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadMedia = async () => {
    if (!image) {
      Alert.alert('Erro', 'Nenhuma imagem selecionada.');
      return;
    }

    setUploading(true);

    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const filename = image.substring(image.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `images/${filename}`);
      
      await uploadBytes(storageRef, blob);

      // Recuperar a URL da imagem após o upload
      const url = await getDownloadURL(storageRef);
      setImageUrl(url); // Atualizar o estado com a URL da imagem

      setImage(null);
      Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar a imagem:', error);
      Alert.alert('Erro', 'Falha ao enviar a imagem.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Upload</Text>
      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Escolher Imagem</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && (
        <TouchableOpacity onPress={uploadMedia} style={styles.button} disabled={uploading}>
          <Text style={styles.buttonText}>{uploading ? 'Enviando...' : 'Enviar Imagem'}</Text>
        </TouchableOpacity>
      )}
      {/* Exibir a imagem carregada */}
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Text>Imagem Carregada:</Text>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
      )}
    </View>
  );
};

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
