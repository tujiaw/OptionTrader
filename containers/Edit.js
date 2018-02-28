import React from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import { CheckBox, Divider } from 'react-native-elements'
import TradeItem from '../components/TradeItem'
import { connect } from 'react-redux'
import * as _ from 'lodash/core'
import * as tradeSettingAction from '../actions/tradeSettingAction'
import controller from '../controller'

class Edit extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
  if (_.isEqual(this.props, nextProps)) {
      return false
    }
    return true
  }

  _onButtonGroupPress = (index, data) => {
    console.log('11111111111', index, data)
    if (!(data.code && data.code.length)) {
      return
    }

    let price = 0
    if (data.editPrice && data.editPrice.length) {
      price = parseFloat(data.editPrice)
    } else {
      if (index === 0 && data.sellPrice && data.sellPrice.length) {
        price = parseFloat(data.sellPrice)
      } else if (index === 1 && data.buyPrice && data.buyPrice.length) {
        price = parseFloat(data.buyPrice)
      }
    }
    if (isNaN(price)) {
      price = 0
    }

    if (index === 0) {
      controller.bid(data.code, price, this.props.setting)
    } else if (index === 1) {
      controller.ofr(data.code, price, this.props.setting)
    } else if (index === 2) {
      controller.cancel(data.code, price)
    }
  }

  _onOfrAvailablePress = () => {
    this.props.updateSetting({enableSellFirst: !this.props.setting.enableSellFirst})
  }

  _onEnableMultiPress = () => {
    this.props.updateSetting({noLimitedNetPosition: !this.props.setting.noLimitedNetPosition})
  }

  _onOpenPress = () => {
    this.props.updateSetting({open: !this.props.setting.open})
  }

  _onClosePress = () => {
    this.props.updateSetting({close: !this.props.setting.close})
  }

  _renderItem = ({item}) => {
    return (
      <TradeItem data={item} onButtonGroupPress={this._onButtonGroupPress}/>
    )
  }

  render() {
    const { list, setting } = this.props
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <CheckBox
            title='Ofr'
            containerStyle={styles.cbContainer}
            checked={setting.enableSellFirst}
            onIconPress={this._onOfrAvailablePress}
          />
          <CheckBox
            title='Mul'
            containerStyle={styles.cbContainer}
            checked={setting.noLimitedNetPosition}
            onIconPress={this._onEnableMultiPress}
          />
          <CheckBox
            title='Open'
            containerStyle={styles.cbContainer}
            checked={setting.open}
            onIconPress={this._onOpenPress}
          />
          <CheckBox
            title='Close'
            containerStyle={styles.cbContainer}
            checked={setting.close}
            onIconPress={this._onClosePress}
          />
        </View>
        <Divider style={{ backgroundColor: 'grey' }} />
        <FlatList
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index}
          data={list}
        />
      </View>
    )        
  }
}

function mapStateToProps(state) {
  return {
    list: state.tradeData,
    setting: state.tradeSetting
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateSetting: (data) => { dispatch(tradeSettingAction.update(data)) }
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: 28,
    marginHorizontal: 2
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    maxHeight: 30,
  },
  cbContainer: {
    margin: 0,
    padding: 0,
    borderWidth: 0,
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Edit)