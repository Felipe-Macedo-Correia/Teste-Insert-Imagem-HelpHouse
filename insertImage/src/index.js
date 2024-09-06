import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { firebase } from '../firebase'; // Certifique-se de que a configuração do Firebase está correta

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const pickImage = async () => {
    // Solicita permissões para acessar a galeria de imagens
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Desculpe, precisamos de permissões para acessar sua galeria de imagens!');
      return;
    }

    // Abre a galeria de imagens e permite ao usuário escolher uma imagem
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Imagens apenas
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('Erro', 'Nenhuma imagem selecionada.');
      return;
    }

    try {
      setUploading(true);

      // Obter informações sobre o arquivo
      const fileInfo = await FileSystem.getInfoAsync(image);

      if (!fileInfo.exists) {
        Alert.alert('Erro', 'O arquivo não existe.');
        return;
      }

      // Ler o arquivo como uma string base64
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Criar um Blob a partir do base64
      const blob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], { type: 'image/jpeg' });

      // Aqui você pode fazer o upload do blob para o Firebase ou outro servidor
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(`images/${Date.now()}.jpg`);
      await imageRef.put(blob);

      Alert.alert('Sucesso', 'Imagem carregada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar a imagem: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Escolher Imagem</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && (
        <TouchableOpacity style={styles.button} onPress={uploadImage} disabled={uploading}>
          <Text style={styles.buttonText}>{uploading ? 'Enviando...' : 'Enviar Imagem'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
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
});
