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
      const marketData = {
        dataType: MARKET_TITLE,
        instId: content.szINSTRUMENT,
        code: 'IC180',
        price: '1279.2',
        dir: '空',
        total: 0,
        yesday: 1,
        today: 0,
        avgPrice: '6307.2',
        profit: '880',
      }
      store.dispatch(marketAction.update(initList))
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