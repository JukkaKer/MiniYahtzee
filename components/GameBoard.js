import React, { useState, useEffect } from "react";
import { Text, View, Pressable} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Grid, Col, Row } from 'react-native-easy-grid';
import styles from '../styles/style';

let board = [];
let spots = new Array(6).fill(0);
//let scores = [];
const NUM_DICE = 5;
const NUM_THROWS = 3;
const BONUS = 63;

export default function Gameboard() {
  const [throwsLeft, setThrowsLeft] = useState(NUM_THROWS);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [selectedDice, setSelectedDice] =
    useState(new Array(NUM_DICE).fill(false));
  const [selectedSpots, setSelectedSpots] =
    useState(new Array(6).fill(false));

  function getDiceColor(i) {
    if(board.every((val, i, arr) => val === arr[0])) {
      return 'orange';
    } else {
      return selectedDice[i] ? 'black' : 'steelblue';
    }
  }

  function getSpotColor(i) {
    return selectedSpots[i] ? 'black' : 'steelblue';
  }

  function selectDice(i) {
    let dice = [...selectedDice];
    dice[i] = selectedDice[i] ? false : true;
    setSelectedDice(dice);
  }

  function selectPts(i) {
    let spot = [...selectedSpots];
    if(board.length <= 0 || throwsLeft > 0) {
      setStatus('Throw 3 times before setting points.')
      return;
    } else if (spot[i] == true) {
      setStatus('You have already selected points for '+(i+1));
      return;
    }
    spot[i] = true;
    setSelectedSpots(spot);
    countSpots(i);
    setThrowsLeft(NUM_THROWS);
    if(selectedSpots.every((val) => val === true)) {
      if(BONUS - total <= 0) {
        total += 35;
      }
    }
  }

  function countSpots(val) {
    let sum = 0;
    for (let i = 0; i < board.length; i++) {
      if(board[i].endsWith(val+1)) {
        sum += val+1;
      }
    }
    spots[val] = sum;
    setTotal(total+sum);
  }

  function throwDice() {
    if(throwsLeft == 0 || selectedSpots.every((val) => val === true)) return;
    for (let i = 0; i < NUM_DICE; i++) {
      if(!selectedDice[i]) {
        let num = Math.floor(Math.random() * 6 + 1);
        board[i] = 'dice-'+num;
      }
    }
    setThrowsLeft(throwsLeft-1);
  }

  const diceRow = [];
  for (let i = 0; i < NUM_DICE; i++) {
    diceRow.push(
      <Pressable
      key={'diceRow'+i}
      onPress={() => selectDice(i)}>
      <MaterialCommunityIcons
        name={board[i]}
        key={'diceRow'+i}
        size={50}
        color={getDiceColor(i)}>
      </MaterialCommunityIcons>
      </Pressable>
    )
  }

  const spotRow = [];
  for (let i = 0; i < 6; i++) {
    spotRow.push(
      <Col key={'spotRow'+i}>
        <Text key={'spotCount'+i}>{spots[i]}</Text>
        <Pressable
        key={'spotPress'+i}
        onPress={() => selectPts(i)}>
        <MaterialCommunityIcons
          name={'numeric-'+(i+1)+'-circle'}
          key={'spotRow'+i}
          size={30}
          color={getSpotColor(i)}>
        </MaterialCommunityIcons>
        </Pressable>
      </Col>
    )
  }

  useEffect(() => {
    if(throwsLeft > 0) {
      setStatus('Throw dice.')
    }
    if(throwsLeft == 0) {
      setStatus('Select your points before next throw.');
    }
    if(throwsLeft < 0) {
      setThrowsLeft(NUM_THROWS-1)
    }
  }, [throwsLeft])

  return (
    <View>
      <View style={styles.row}>{diceRow}</View>
      <Text style={styles.status}>Throws left: {throwsLeft}</Text>
      <Text style={styles.status}>{status}</Text>
      <Pressable style={styles.button} onPress={throwDice}>
        <Text>Throw dice</Text>
      </Pressable>
      <Text style={styles.status}>Total: {total}</Text>
      <Text style={styles.bonus}>You are {BONUS - total} points away from bonus.</Text>
      <Grid>
        <Row>{spotRow}</Row>
      </Grid>
    </View>
  );
}