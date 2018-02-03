import React from 'react'
import { StyleSheet, View, Text, SectionList } from 'react-native'
import { connect } from 'react-redux'
import MainHeader from '../components/MainHeader'
import MarketHeader from '../components/MarketHeader'
import OrderHeader from '../components/OrderHeader'
import MarketItem from '../components/MarketItem'
import OrderItem from '../components/OrderItem'

class Show extends React.Component {
  _renderHeader = ({section}) => {
    if (section.title.name === '市场') {
      return MarketHeader(section)
    } else {
      return OrderHeader(section)
    }
  }

  _renderItem = ({item}) => {
    if (item.dataType === '市场') {
      return (
        <MarketItem data={item} />
      )
    } else {
      return (
        <OrderItem data={item}/>
      )
    }
  }

  render() {
    return (
      <View style={styles.root}>
        <MainHeader data={this.props.capitalStateData} />
        <SectionList
          style={styles.list}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderHeader}
          sections={this.props.dataList}
          keyExtractor={(item, index) => ('i-' + index + item)}
        />
      </View>
    )        
  }
}

function mapStateToProps(state) {
  return {
    capitalStateData: state.capitalStateData,
    dataList: [state.marketData, state.orderData]
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 22
  },
  list: {
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Show)