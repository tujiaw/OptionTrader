import React from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import { CheckBox, Divider } from 'react-native-elements'
import TradeItem from '../components/TradeItem'
import { connect } from 'react-redux'
import * as _ from 'lodash/core'
import controller from '../controller'

class Edit extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
  if (_.isEqual(this.props, nextProps)) {
      return false
    }
    return true
  }

  _onButtonGroupPress = (index, data) => {
    if (!(data.code && data.code.length)) {
      return
    }

    let price = 0
    if (data.editPrice && data.editPrice.length) {
      price = parseFloat(data.editPrice)
    } else {
      if (index === 0 && data.buyPrice && data.buyPrice.length) {
        price = parseFloat(data.buyPrice)
      } else if (index === 1 && data.sellPrice && data.sellPrice.length) {
        price = parseFloat(data.sellPrice)
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
    const newSetting = Object.assign({}, this.props.setting, {enableSellFirst: !this.props.setting.enableSellFirst})
    controller.updateSetting(newSetting)
  }

  _onEnableMultiPress = () => {
    const newSetting = Object.assign({}, this.props.setting, {noLimitedNetPosition: !this.props.setting.noLimitedNetPosition})
    controller.updateSetting(newSetting)
  }

  _onOpenPress = () => {
    const newSetting = Object.assign({}, this.props.setting, {open: !this.props.setting.open})
    controller.updateSetting(newSetting)
  }

  _onClosePress = () => {
    const newSetting = Object.assign({}, this.props.setting, {close: !this.props.setting.close})
    controller.updateSetting(newSetting)
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
            title='SellFirst'
            containerStyle={styles.cbContainer}
            checked={setting.enableSellFirst}
            onIconPress={this._onOfrAvailablePress}
          />
          <CheckBox
            title='NoLimit'
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
    justifyContent: 'space-around',
    maxHeight: 30,
  },
  cbContainer: {
    margin: 0,
    padding: 0,
    borderWidth: 0,
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Edit)