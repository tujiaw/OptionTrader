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
import dispatchObj from './dispatch'

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
  ], (name, content) => {
    console.log('publish', name)
    if (dispatchObj[name]) {
      dispatchObj[name](content)
    }
  })
})
.then((json) => {
  console.log('subscribe result', json)
})
.catch((err) => {
  console.log(JSON.stringify(err))
})

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