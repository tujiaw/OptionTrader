import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

const MarketHeader = (props) => {
  const {title} = props
  return (
    <View style={styles.root}>
      <Text>{title.name}</Text>
      <View style={styles.columnList}>
      {title.columnList && title.columnList.map((item, index) => {
        return <Text key={index}>{item}</Text>
      })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  columnList: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})

export default MarketHeader