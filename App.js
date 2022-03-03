import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import styles from './styles/style'
import Header from './components/Header';
import Footer from './components/Footer';
import Gameboard from './components/GameBoard';

export default function App() {

  return (
    <View style={styles.container}>
      <Header />
      <Gameboard />
      <Footer />
    </View>
  );
}
