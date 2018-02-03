import React from 'react'
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class RemoveButton extends React.Component {
  state = {
    name: 'ios-remove-circle'
  }

  _onPressIn = () => {
    this.setState({name: 'ios-remove-circle-outline'})
  }

  _onPressOut = () => {
    this.setState({name: 'ios-remove-circle'})
  }

  _onPress = () => {
    this.props.onPress && this.props.onPress()
  }

  render() {
    return (
      <TouchableWithoutFeedback 
        onPressIn={this._onPressIn} 
        onPressOut={this._onPressOut}
        onPress={this._onPress}
      >
        <Ionicons
          name={this.state.name}
          size={18}
          style={styles.icon}
        />
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    
  }
})
