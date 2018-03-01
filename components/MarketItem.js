import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default class MarketItem extends React.Component {
  render() {
    const {data} = this.props
    return (
      <View style={styles.root}>
        <Text style={[styles.baseText, styles.code]}>{data.code}</Text>
        <Text style={[styles.baseText]}>{data.price || 0}</Text>
        <Text style={[styles.baseText]}>{data.dir || 0}</Text>
        <Text style={[styles.baseText]}>{data.total || 0}</Text>
        <Text style={[styles.baseText]}>{data.yesday || 0}</Text>
        <Text style={[styles.baseText]}>{data.today || 0}</Text>
        <Text style={[styles.baseText]}>{data.avgPrice || 0}</Text>
        <Text style={[styles.baseText]}>{data.profit || 0}</Text>
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
