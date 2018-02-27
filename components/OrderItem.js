import React from 'react'
import { StyleSheet, View, Text, Alert } from 'react-native'
import RemoveButton from './RemoveButton'

export default class OrderItem extends React.Component {
  _onCancel = () => {
    Alert.alert('提示', '确定要撤销这个单子吗？', [
      {text: 'Cancel', onPress: console.log('cancel') },
      {text: 'Ok', onPress: this.props.onRemove }
    ])
  }

  render() {
    const {data} = this.props
    return (
      <View style={styles.root}>
        <Text style={styles.column}>{data.orderTime || '--'}</Text>
        <Text style={styles.column}>{data.code || '--'}</Text>
        <Text style={styles.column}>{data.price || '--'}</Text>
        <Text style={styles.column}>{data.dir || '--'}</Text>
        <Text style={styles.column}>{data.operate || '--'}</Text>
        <Text style={styles.column}>{data.status || '--'}</Text>
        <Text style={styles.column}>{data.tradeTime || '--'}</Text>
        {data.cancel==='wait' && 
          <RemoveButton onPress={this._onCancel} />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },

})