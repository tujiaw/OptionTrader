import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class OrderItem extends React.Component {
  render() {
    const {data} = this.props
    return (
      <View style={styles.root}>
        <Text style={styles.column}>{data.orderTime}</Text>
        <Text style={styles.column}>{data.code}</Text>
        <Text style={styles.column}>{data.price}</Text>
        <Text style={styles.column}>{data.dir}</Text>
        <Text style={styles.column}>{data.operate}</Text>
        <Text style={styles.column}>{data.status}</Text>
        <Text style={styles.column}>{data.tradeTime}</Text>
        {data.cancel==='wait' && 
          <Ionicons
            name={'ios-remove-circle'}
            size={18}
          />
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