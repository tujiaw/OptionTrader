import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default class Me extends React.Component {
  render() {
    return (
      <View style={styles.root}>
        <Text>Me</Text>
      </View>
    )        
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})