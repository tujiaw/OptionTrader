import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { FormInput, Button, ButtonGroup } from 'react-native-elements'

function LeftTop(props) {
  return (
    <View style={styles.leftTop}>
      <View style={styles.leftTopCol1}>
        <Text>I01082</Text>
        <Text>6000</Text>
        <Text>0000</Text>
      </View>
      <View style={styles.leftTopCol2}>
        <Text>C0000</Text>
        <Text>0</Text>
        <Text>0</Text>
      </View>
      <View style={styles.leftTopCol3}>
        <Text>00</Text>
        <Text></Text>
        <Text>00000</Text>
        <Text></Text>
      </View>
    </View>
  )
}

function RightTop(props) {
  const buttons = ['+', '-', '++', '--']
  return (
    <View style={styles.rightTop}>
      <View style={styles.rightTopRow1}>
        <Text>Buy:2</Text>
        <Text>Sell:1</Text>
        <Text>L</Text>
      </View>
      <View>
        <FormInput />
      </View>
      <View style={styles.rightTopRow3}>
        <ButtonGroup 
          buttons={buttons}
          containerStyle={styles.plusButtonGroup}
        />
      </View>
    </View>
  )
}

export default class TradeItem extends React.Component {
  render() {
    const { data } = this.props
    const buttons = ['B IH18C2', 'S IH18C2', 'X']
    return (
      <View style={styles.root}>
        <View style={styles.row1}>
          <LeftTop />
          <RightTop />
        </View>
        <View style={styles.row2}>
          <ButtonGroup 
            buttons={buttons}
            containerStyle={styles.operButtonGroup}
          />
        </View>
        <View style={styles.row3}>
          <Text style={styles.tips}>{'Trade:{ IC1802  SellOpen  6207.2 }'}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'aliceblue',
    padding: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'darkgrey',
    borderRadius: 5,
  },
  row1: {
    flex: 1,
    flexDirection: 'row',
  },
  row2: {
    flex: 1,
  },
  leftTop: {
    flex: 1,
    flexDirection: 'row',
  },
  leftTopCol1: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  leftTopCol2: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  leftTopCol3: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  rightTop: {
    flex: 1,
    flexDirection: 'column'
  },
  rightTopRow1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rightTopRow2: {
    flex: 1,
  },
  rightTopRow3: {
    flex: 1,
    flexDirection: 'row'
  },
  plusButtonGroup: {
    flex: 1,
    maxHeight: 20,
  },
  operButtonGroup: {
    flex: 1,
    maxHeight: 50,
  },
  buttonStyle: {
    width: 5,
  },
  tips: {
    color: 'darkgrey'
  },
})