import React from 'react'
import { StyleSheet, View, Text, TouchableNativeFeedback } from 'react-native'
import { Button } from 'react-native-elements'

class SettingRow extends React.Component {
  render() {
    return (
      <TouchableNativeFeedback onPress={this.props.onPress} background={TouchableNativeFeedback.SelectableBackground()} >
        <View style={styles.rowContainer}>
          <View style={styles.rowContent} >
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.value}>{this.props.value}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

export default class Me extends React.Component {
  state = {
    tips: '',
    loading: false,
  }

  _onLogin = () => {
    if (this.state.isLogined) {
      this.setState({isLogined: false})
      return
    }

    if (this.state.username.length === 0) {
      this.setState({ tips: '用户名不能为空!'})
      return
    }
    if (this.state.password.length === 0) {
      this.setState({ tips: '密码不能为空!'})
      return
    }


    setTimeout(() => {
      this.setState({isLogined: true, loading: false})
    }, 3000)
    this.setState({tips: '', loading: true})
  }

  _onCodePress = () => {
    console.log('11111111111111')
  }

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.header}>设置</Text>
        <SettingRow title="代码" value="IC1803;IF1803;IH1803;I1805" onPress={this._onCodePress}/>
        <SettingRow title="地址" value="47.100.7.224" />
        <SettingRow title="端口" value="55555" />
        <Button 
          buttonStyle={styles.reconnect}
          title={ '重连' } 
          raised={false} 
          onPress={this._onLogin} 
          loading={this.state.loading}
        />
      </View>
    )        
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: 30,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 5,
  },
  rowContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    maxHeight: 40,
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'grey',
  },
  title: {
    color: 'black'
  },
  value: {
    color: 'grey'
  },
  reconnect: {
    marginTop: 20,
    backgroundColor: 'red'
  }
})