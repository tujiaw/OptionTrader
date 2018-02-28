import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { FormInput, Button, ButtonGroup } from 'react-native-elements'

function LeftTop(props) {
  const { data, onValueChanged } = props
  return (
    <View style={styles.leftTop}>
      <View style={styles.leftTopCol1}>
        <Text>{data.code || ''}</Text>
        <TouchableOpacity onPress={() => { onValueChanged && onValueChanged(data.sellPrice) }} >
          <Text>{data.sellPrice || '0000'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { onValueChanged && onValueChanged(data.buyPrice) }} >
          <Text>{data.buyPrice || '0000'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.leftTopCol2}>
        <Text>{data.spotPrice || 'C0000'}</Text>
        <Text>{data.sellVolume || '0'}</Text>
        <Text>{data.buyVolume || '0'}</Text>
      </View>
      <View style={styles.leftTopCol3}>
        <Text>{data.futuresMinusPostPrice || '00'}</Text>
        <Text></Text>
        <TouchableOpacity onPress={() => { onValueChanged && onValueChanged(data.dealPrice) }} >
          <Text>{data.dealPrice || '00000'}</Text>
        </TouchableOpacity>
        <Text></Text>
      </View>
    </View>
  )
}

function RightTop(props) {
  const {data, editPrice, onValueAdd, onValueChanged} = props
  const buttons = ['+', '-', '++', '--']
  const values = [0.2, -0.2, 1, -1]
  return (
    <View style={styles.rightTop}>
      <View style={styles.rightTopRow1}>
        <Text>{'Buy:' + data.morePosition || 0}</Text>
        <Text>{'Sell:' + data.emptyPosition || 0}</Text>
        <Text>{data.lock || ''}</Text>
      </View>
      <View>
        <FormInput value={editPrice || ''} onChangeText={onValueChanged} />
      </View>
      <View style={styles.rightTopRow3}>
        <ButtonGroup 
          buttons={buttons}
          containerStyle={styles.plusButtonGroup}
          textStyle={styles.buttonText}
          onPress={(index) => { onValueAdd && onValueAdd(values[index]) }}
        />
      </View>
    </View>
  )
}

export default class TradeItem extends React.Component {
  state = {
    editPrice: ''
  }

  _onPriceChanged = (value) => {
    this.setState({ editPrice: '' + value })
  }

  _onPriceAdd = (value) => {
    if (this.state.editPrice.length === 0) {
      return
    }
    let fsrc = parseFloat(this.state.editPrice)
    let fadd = parseFloat(value)
    if (isNaN(fsrc) || isNaN(fadd)) {
      return
    }
    fsrc += fadd
    this.setState({ editPrice: '' + fsrc.toFixed(2) })
  }

  _onButtonGroupPress = (index) => {
    const { onButtonGroupPress } = this.props
    if (onButtonGroupPress) {
      const data = Object.assign({}, this.props.data, this.state)
      onButtonGroupPress(index, data)
    }
  }

  render() {
    const { data } = this.props
    const buttons = ['B ' + data.code, 'S ' + data.code, 'X']
    return (
      <View style={styles.root}>
        <View style={styles.row1}>
          <LeftTop data={data} onValueChanged={this._onPriceChanged} />
          <RightTop data={data} 
            editPrice={this.state.editPrice} 
            onValueAdd={this._onPriceAdd}
            onValueChanged={this._onPriceChanged}
          />
        </View>
        <View style={styles.row2}>
          <ButtonGroup 
            buttons={buttons}
            containerStyle={styles.operButtonGroup}
            textStyle={styles.buttonText}
            onPress={this._onButtonGroupPress}
          />
        </View>
        <Text style={styles.tips}>{data.tips || ''}</Text>
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
    justifyContent: 'flex-end',
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
    maxHeight: 30,
  },
  buttonStyle: {
    width: 5,
  },
  tips: {
    color: 'darkgrey',
  },
  buttonText: {
    fontWeight: 'bold'
  }
})