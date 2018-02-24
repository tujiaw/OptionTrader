import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { FormLabel, 
  FormInput, 
  FormValidationMessage, 
  Button,
  Avatar
} from 'react-native-elements'

export default class Me extends React.Component {
  state = {
    tips: '',
    isLogined: false,
    username: '',
    password: '',
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

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.avatar}>
          <Avatar
            large
            rounded
            source={require('../res/myavatar.jpg')}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
          />
          <Text style={styles.avatarName}>{this.state.isLogined ? this.state.username : '用户'}</Text>
        </View>

        <FormLabel labelStyle={styles.username}>用户名</FormLabel>
        <FormInput 
          onChangeText={text => this.setState({ username: text})} 
          editable={!this.state.isLogined} 
        />
        <FormLabel>密码</FormLabel>
        <FormInput 
          onChangeText={text => this.setState({password: text})} 
          secureTextEntry={true} 
          editable={!this.state.isLogined}
        />
        <Button 
          title={this.state.isLogined ? '退出' : '登录'} 
          raised={false} 
          onPress={this._onLogin} 
          loading={this.state.loading}
        />
        <FormValidationMessage>{this.state.tips}</FormValidationMessage>
      </View>
    )        
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginLeft: 50,
    marginRight: 50,
    justifyContent: 'center',
  },
  avatar: {
    flex: 1,
    alignItems: 'center',
    maxHeight: 100,
  },
  avatarName: {
    fontSize: 14
  },
  username: {
    // alignSelf: 'flex-start'
  }
})