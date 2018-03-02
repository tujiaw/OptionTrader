import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default class AccountHeader extends React.Component {
  render() {
    const { data } = this.props
    return (
      <View style={styles.root}>
        <View style={styles.item}>
          <Text style={styles.itemText}>DynamicEquity</Text>
          <Text style={styles.itemValue}>{data.dynamicEquity || '0'}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>FrozenCapital</Text>
          <Text style={styles.itemValue}>{data.frozenCapital || '0'}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>AvaiableCapital</Text>
          <Text style={styles.itemValue}>{data.avaiableCapital || '0'}</Text>
        </View>
      </View>
    )        
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 3,
    flexDirection: 'row',
    alignContent: 'space-around',
    maxHeight: 45,
  },
  item: {
    flex: 1,
  },
  itemText: {
    alignSelf: 'center'
  },
  itemValue: {
    color: 'blue',
    alignSelf: 'center'
  }
})