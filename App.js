import React from 'react';
import { StyleSheet, Text, View, BackHandler, ToastAndroid } from 'react-native';
import { TabNavigator } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Show from './containers/Show'
import Edit from './containers/Edit'
import Me from './containers/Me'
import { Provider } from 'react-redux'
import store from './utils/store'
import testStart from './databus/test'
import appClient from './databus'
import Config from './config'

import * as capitalStateAction from './actions/capitalStateAction'
import * as marketAction from './actions/marketAction'
import * as orderAction from './actions/orderAction'
import * as tradeAction from './actions/tradeAction'
import { MARKET_TITLE, ORDER_TITLE } from './constants'

// Trade.MarketData
  //  "dAskPrice1": 551,
  //  "dAvgPrice": 54959.5811481107,
  //  "dBidPrice1": 550.5,
  //  "dLastPrice": 550.5,
  //  "dLowerLimitPrice": 506,
  //  "dOpenInt": 1476518,
  //  "dUpperLimitPrice": 594,
  //  "nAskVolume1": 3327,
  //  "nBidVolume1": 1071,
  //  "nUpdateMillisec": 0,
  //  "nVolume": 253216,
  //  "szINSTRUMENT": "i1805",
  //  "szUpdateTime": "20180226 21:59:21",
  
let tradingAccountCount = 0
function onPublishCallback(name, content) {
  console.log('publish', name)
  if (name === 'Trade.TradingAccount') {
    tradingAccountCount++
    if (tradingAccountCount > 3) {
      return 
    }
    const obj = {
      dynamicEquity: content.dDynamicEquity || 0 ,
      frozenCapital: content.dFrozenCapital || 0,
      avaiableCapital: content.dAvaiableCapital || 0
    }
    obj.dynamicEquity = obj.dynamicEquity.toFixed(2)
    obj.frozenCapital = obj.frozenCapital.toFixed(2)
    obj.avaiableCapital = obj.avaiableCapital.toFixed(2)
    store.dispatch(capitalStateAction.update(obj))
  } else if (name === 'Trade.MarketData') {
    if (content.szINSTRUMENT && content.szINSTRUMENT.length) {
      const obj = {
          code: content.szINSTRUMENT,
          spotPrice: '00000',                 // 现货价格
          futuresMinusPostPrice: '00',        // 期货价格-现货价格
          morePosition: '0',             // 当前品种的多单仓位
          emptyPosition: '0',           // 当前品种的空单仓位
          lock: 'L',                          // 锁住或打开下单按钮和撤单按钮
          sellPrice: content.dAskPrice1,                    // 卖价
          buyPrice: content.dBidPrice1,                     // 买价
          sellVolume: content.nAskVolume1,                      // 卖量
          buyVolume: content.nBidVolume1,                       // 买量
          dealPrice: content.dLastPrice,                       // 成交价
          placeOrderPrice: '',                // 下单价格
      }
      store.dispatch(tradeAction.update(obj))
    }
  }
}

appClient.initProtoJson()
appClient.setHeartBeatIntervalSecond(10)
appClient.open('47.100.7.224', '55555')
.then((json) => {
  console.log('start web socket ok', json)
  return appClient.post('Trade.LoginReq', 'Trade.LoginResp', {
    userid: 'admin', 
    passwd: 'admin',
    instruments: Config.instruments
  })
})
.then((json) => {
  console.log('LoginResp', json)
  return appClient.subscribe([
    'Trade.TradingAccount', 
    'Trade.MarketData',
    'Trade.Position',
    'Trade.Order',
    'Trade.Trade',
    'Trade.ErrorInfo'
  ], onPublishCallback)
})
.then((json) => {
  console.log('subscribe result', json)
})
.catch((err) => {
  console.log(JSON.stringify(err))
})

testStart()
const MainTab = TabNavigator(
  {
    Show: {
      screen: Show,
      navigationOptions: {
        tabBarLabel: '持仓',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-list-box' : 'ios-list-box-outline'}
            size={20}
            style={{ color: tintColor }}
          />
        )
      }
    },
    Edit: {
      screen: Edit,
      navigationOptions: {
        tabBarLabel: '下单',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-create' : 'ios-create-outline'}
            size={20}
            style={{ color: tintColor }}
          />
        )
      }
    },
    Me: {
      screen: Me,
      navigationOptions: {
        tabBarLabel: '我',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-person' : 'ios-person-outline'}
            size={20}
            style={{ color: tintColor }}
          />
        )
      }
    },
  }, {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      showIcon: true,
      labelStyle: {
        fontSize: 10,
      },
      style: {
        height: 60,
      },
    }
  }
)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.backPressTime = []
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  
  handleBack = () => {
    if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
      // 两秒钟之内按两次Back键退出程序
      return false
    }
    this.lastBackPressed = Date.now()
    ToastAndroid.show('再按一次退出程序', ToastAndroid.SHORT);
    return true;
  }

  render() {
    return (
      <Provider store={store}>
        <MainTab />
      </Provider>
    )
  }
}

export default App