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

testStart()
const MainTab = TabNavigator(
  {
    Show: {
      screen: Show,
      navigationOptions: {
        tabBarLabel: '持仓',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
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
    // 两秒钟之内按两次Back键退出程序
    this.backPressTime.push(new Date());
    const count = this.backPressTime.length;
    if (count >= 2) {
      const ms = this.backPressTime[count - 1] - this.backPressTime[count - 2];
      this.backPressTime = [];
      if (ms <= 2000) {
        return false;
      }
    }
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