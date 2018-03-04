import React from 'react'
import { StyleSheet, View, Text, TouchableNativeFeedback, ToastAndroid, BackHandler } from 'react-native'
import { Button, Overlay, Input } from 'react-native-elements'
import ModifyOverlay from '../components/ModifyOverlay'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import controller from '../controller'
import MainHeader from './MainHeader'

const CODE_TITLE = '修改代码'
const WSIP_TITLE = '修改地址'
const WSPORT_TITLE = '修改端口'
const USERNAME_TITLE = '修改用户名'
const PASSWORD_TITLE = '修改密码'

class SettingRow extends React.Component {
  render() {
    let { title, value, password } = this.props
    if (password && value) {
      value = _.pad('', value.length, '*')
    }

    return (
      <TouchableNativeFeedback onPress={this.props.onPress} background={TouchableNativeFeedback.SelectableBackground()} >
        <View style={styles.rowContainer}>
          <View style={styles.rowContent} >
            <Text style={styles.title}>{title || ''}</Text>
            <Text style={styles.value}>{value || ''}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

class Me extends React.Component {
  state = {
    loading: false,
    overlayState: {
      isVisible: false
    }
  }

  _onLogout = () => {
    controller.logout().then(json => {
      if (json.retCode === 0) {
        ToastAndroid.show('登出成功', ToastAndroid.SHORT);
        controller.clearAllData();
      } else {
        ToastAndroid.show('登出失败:' + json.msg, ToastAndroid.SHORT);
      }
    }).catch(err => {
      ToastAndroid.show('退出异常', ToastAndroid.SHORT);
    })
  }
  
  _onLogin = () => {
    if (this.isLoading) {
      return
    }

    this.isLoading = true
    this.setState({loading: true})
    controller.relogin(this.props.localConfig).then(json => {
      this.setState({isLogined: true, loading: false})
      this.isLoading = false
      if (json.retCode === 0) {
        ToastAndroid.show('登录成功', ToastAndroid.SHORT);
      } else if (json.msg) {
        ToastAndroid.show('登录失败,' + json.msg, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('登录失败', ToastAndroid.SHORT);
      }
    }).catch((err) => {
      this.setState({isLogined: true, loading: false})
      this.isLoading = false
      ToastAndroid.show('登录异常', ToastAndroid.SHORT);
      console.error(err)
    })
  }

  _onExit = () => {
    BackHandler.exitApp()
  }

  getCodeStr = () => {
    const { localConfig } = this.props
    const codeStr = localConfig.codeList ? localConfig.codeList.join(';') : ''
    return codeStr
  }

  _onCodePress = () => {
    this.setState({ 
      overlayState: { 
        isVisible: true,
        title: CODE_TITLE,
        text: this.getCodeStr()
    }})
  }

  _onIpPress = () => {
    this.setState({ 
      overlayState: { 
        isVisible: true,
        title: WSIP_TITLE,
        text: this.props.localConfig.wsip
    }})
  }

  _onPortPress = () => {
    this.setState({ 
      overlayState: { 
        isVisible: true,
        title: WSPORT_TITLE,
        text: this.props.localConfig.wsport
    }})
  }

  _onUsernamePress = () => {
    this.setState({ 
      overlayState: { 
        isVisible: true,
        title: USERNAME_TITLE,
        text: this.props.localConfig.username
    }})
  }

  _onPasswordPress = () => {
    this.setState({ 
      overlayState: { 
        isVisible: true,
        title: PASSWORD_TITLE,
        text: this.props.localConfig.password
    }})
  }

  _onOverlayChanged = (cmd, title, text) => {
    this.setState({
      overlayState: {
        isVisible: false
      }
    })

    if (cmd === 'ok') {
      if (!(title && title.length && text && text.length)) {
        return
      }

      const newConfig = _.cloneDeep(this.props.localConfig)
      if (title === CODE_TITLE) {
        Object.assign(newConfig, { codeList: text.split(';') })
      } else if (title === WSIP_TITLE) {
        Object.assign(newConfig, { wsip: text })
        ToastAndroid.show('地址改变了，需要重启App才能生效', ToastAndroid.SHORT);
      } else if (title === WSPORT_TITLE) {
        Object.assign(newConfig, { wsport: text })
        ToastAndroid.show('端口改变了，需要重启App才能生效', ToastAndroid.SHORT);
      } else if (title === USERNAME_TITLE) {
        Object.assign(newConfig, { username: text })
      } else if (title === PASSWORD_TITLE) {
        Object.assign(newConfig, { password: text })
      }
      controller.updateLocalConfig(newConfig)
    }
  }

  render() {
    const { overlayState } = this.state
    const { localConfig } = this.props
    const codeStr = this.getCodeStr()

    return (
      <View style={styles.root}>
        <MainHeader title='设置' />
        <SettingRow title="代码" value={codeStr} onPress={this._onCodePress} />
        <SettingRow title="地址" value={localConfig.wsip} onPress={this._onIpPress} />
        <SettingRow title="端口" value={localConfig.wsport} onPress={this._onPortPress} />
        <SettingRow title="用户名" value={localConfig.username} onPress={this._onUsernamePress} />
        <SettingRow title="密码" value={localConfig.password} password={true} onPress={this._onPasswordPress} />
        <Button 
          buttonStyle={styles.reconnect}
          text="登出"
          raised={false} 
          onPress={this._onLogout} 
          loadingProps={{ size: "large", color: "rgba(111, 202, 186, 1)" }}
        />
        <Button 
          buttonStyle={styles.reconnect}
          text="重新登录"
          raised={false} 
          onPress={this._onLogin} 
          loading={this.state.loading}
          loadingProps={{ size: "large", color: "rgba(111, 202, 186, 1)" }}
        />
        <Button 
          buttonStyle={[styles.reconnect, {backgroundColor: 'red'}]}
          text="退出"
          raised={false} 
          onPress={this._onExit} 
        />
        <ModifyOverlay data={overlayState} onChanged={this._onOverlayChanged}/>
      </View>
    )        
  }
}

function mapStateToProps(state) {
  return {
    localConfig: state.localConfig
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
    marginTop: 10,
    width: 300
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Me)