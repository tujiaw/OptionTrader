import React from 'react'
import { View, Text } from 'react-native'

export default class MarketItem extends React.Component {
  render() {
    const {data} = this.props
    console.log(this.props)
    return (
      <View>
        <Text>{data.dBidPrice1}</Text>
        <Text>{data.nBidVolume1}</Text>
      </View>
    )
  }
}