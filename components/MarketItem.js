import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default class MarketItem extends React.Component {
  render() {
    const {data} = this.props
    return (
      <View style={styles.root}>
        <Text style={[styles.baseText, styles.code]}>{data.code}</Text>
        <Text style={[styles.baseText]}>{data.price || '--'}</Text>
        <Text style={[styles.baseText]}>{data.dir || '0'}</Text>
        <Text style={[styles.baseText]}>{data.total || '--'}</Text>
        <Text style={[styles.baseText]}>{data.yesday || '0'}</Text>
        <Text style={[styles.baseText]}>{data.today || '--'}</Text>
        <Text style={[styles.baseText]}>{data.avgPrice || '--'}</Text>
        <Text style={[styles.baseText]}>{data.profit || '--'}</Text>
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
  baseText: {
  },
  code: {
    color: 'red'
  }
})
