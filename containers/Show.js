import React from 'react'
import { StyleSheet, View, Text, SectionList, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import MainHeader from '../components/MainHeader'
import MarketHeader from '../components/MarketHeader'
import OrderHeader from '../components/OrderHeader'
import MarketItem from '../components/MarketItem'
import OrderItem from '../components/OrderItem'
import { MARKET_TITLE, ORDER_TITLE } from '../constants'
import store from '../utils/store'
import * as orderAction from '../actions/orderAction'
import * as _ from 'lodash/core'
import controller from '../controller'

class Show extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (_.isEqual(this.props, nextProps)) {
      return false
    }
    return true
  }

  _renderHeader = ({section}) => {
    if (section.title.name === MARKET_TITLE) {
      return MarketHeader(section)
    } else if (section.title.name === ORDER_TITLE) {
      return OrderHeader(section)
    } else {
      return null
    }
  }

  _renderItem = ({item}) => {
    if (item.dataType === MARKET_TITLE) {
      return (
        <MarketItem data={item} />
      )
    } else if (item.dataType === ORDER_TITLE) {
      return (
        <OrderItem data={item} onRemove={() => { this._onRemoveOrder(item.orderId) }} />
      )
    } else {
      return null
    }
  }

  _onRemoveOrder = (orderId) => {
    if (orderId && orderId > 0) {
      controller.cancelReq(orderId).then(json => {
        if (json.retCode === 0) {
          this.props.removeOrder(orderId)
        } else {
          ToastAndroid.show(json.msg, ToastAndroid.SHORT);
        }
      }).catch(err => {
        ToastAndroid.show('error', ToastAndroid.SHORT);
      })
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
          keyExtractor={(item, index) => ('i-' + index)}
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
  return {
    removeOrder: (orderId) => { store.dispatch(orderAction.remove(orderId)) }
  }
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