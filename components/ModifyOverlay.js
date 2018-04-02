import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Button, Overlay, Input } from 'react-native-elements'

export default class ModifyOverlay extends React.Component {
  state = {
    inputText: ''
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps
    if (data && data.text) {
      this.setState({ inputText: data.text })
    }
  }

  _onClose = () => {
    this.props.onChanged('close')
  }

  _onCancel = () => {
    this.props.onChanged('cancel')
  }

  _onOk = () => {
    this.props.onChanged('ok', this.props.data.title, this.state.inputText)
  }

  render() {
    const {data} = this.props
    return (
      <Overlay 
        isVisible={data.isVisible}
        width="auto"
        height="auto"
      >
        <Text>{data.title || 'tips'}</Text>
        <Input         
          onChangeText={(inputText) => this.setState({inputText})}
          value={this.state.inputText}
        />
        <View style={styles.buttons}>
          <Button buttonStyle={styles.button} title="取消" onPress={this._onCancel} />
          <Button buttonStyle={styles.button} title="确定" onPress={this._onOk} />
        </View>
      </Overlay>
    )
  }
}

const styles = {
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    maxHeight: 50,
    marginTop: 20,
  },
  button: {
    marginLeft: 20,
    width: 60,
    height: 30
  }
}