import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import Upload from './src/index';
const InserFoto = () => {
    return (
        <View style={styles.container}>
            <Upload/>
        </View>
    );
};

export default InserFoto;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
