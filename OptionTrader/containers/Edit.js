import React from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import TradeItem from '../components/TradeItem'
import { connect } from 'react-redux'

class Edit extends React.Component {
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
          data={this.props.list}
        />
      </View>
    )        
  }
}

function mapStateToProps(state) {
  return {
    list: state.tradeData
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const styles = StyleSheet.create({
  root: {
    marginTop: 25,
    marginHorizontal: 2
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Edit)