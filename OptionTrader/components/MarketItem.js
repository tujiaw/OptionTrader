import React from 'react'
import { View, Text } from 'react-native'

export default class MarketItem extends React.Component {
  render() {
    const {data} = this.props
    console.log(data)
    return (
      <View>
        <Text>{data.code}</Text>
        <Text>{data.price}</Text>
      </View>
    )
  }
}