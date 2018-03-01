import React from 'react'
import { StyleSheet, View, Text, TouchableNativeFeedback, Modal } from 'react-native'
import { Button, Overlay, Input } from 'react-native-elements'
import ModifyOverlay from '../components/ModifyOverlay'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import controller from '../controller'

const CODE_TITLE = '修改代码'
const WSIP_TITLE = '修改地址'
const WSPORT_TITLE = '修改端口'

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

class Me extends React.Component {
  state = {
    tips: '',
    loading: false,
    overlayState: {
      isVisible: false
    }
  }

  _onLogin = () => {
    // setTimeout(() => {
    //   this.setState({isLogined: true, loading: false})
    // }, 3000)
    // this.setState({tips: '', loading: true})
    controller.restart(this.props.localConfig)
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
        Object.assign(newConfig, {
          codeList: text.split(';')
        })
      } else if (title === WSIP_TITLE) {
        Object.assign(newConfig, {
          wsip: text
        })
      } else if (title === WSPORT_TITLE) {
        Object.assign(newConfig, {
          wsport: text
        })
      } else {
        return
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
        <Text style={styles.header}>设置</Text>
        <SettingRow title="代码" value={codeStr} onPress={this._onCodePress} />
        <SettingRow title="地址" value={localConfig.wsip} onPress={this._onIpPress} />
        <SettingRow title="端口" value={localConfig.wsport} onPress={this._onPortPress} />
        <Button 
          buttonStyle={styles.reconnect}
          text="重新登录"
          raised={false} 
          onPress={this._onLogin} 
          loading={this.state.loading}
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
    paddingTop: 30,
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
    width: 150
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Me)