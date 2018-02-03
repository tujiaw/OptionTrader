import React from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import TradeItem from '../components/TradeItem'

export default class Edit extends React.Component {
  state = {
    list: [{
      code: '2324'
    }, {
      code: '3435'
    }, {
      code: '34355'
    }, {
      code: '23244'
    }]
  }

  _renderItem = ({item}) => {
    return (
      <TradeItem data={item} />
    )
  }

  render() {
    return (
      <View style={styles.root}>
        <FlatList
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index}
          data={this.state.list}
        />
      </View>
    )        
  }
}

const styles = StyleSheet.create({
  root: {
    marginTop: 25,
    marginHorizontal: 2
  },
})