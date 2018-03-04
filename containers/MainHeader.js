import React from 'react'
import { Header, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { CONNECT_STATUS } from '../constants'
import { connect } from 'react-redux'
import controller from '../controller'

class MainHeader extends React.Component {
  _onLeftPress = () => {

  }

  _onRightPress = () => {
    const { netStatus } = this.props.localConfig
    if (netStatus === CONNECT_STATUS.CLOSED || netStatus === CONNECT_STATUS.CLOSING) {
      controller.restart(this.props.localConfig)
    } else if (netStatus === CONNECT_STATUS.OPEN) {
      controller.relogin(this.props.localConfig)
    }
  }

  render() {
    const { netStatus } = this.props.localConfig
    let title = this.props.title || 'Option Trader'
    let leftIconName = 'lock'
    let rightIconName = 'refresh'
    let loading = true
    if (netStatus === CONNECT_STATUS.OPEN) {
      loading = false
    } 

    return (
      <Header
      outerContainerStyles={styles.innerContainer}
        leftComponent={<Button
          onPress={this._onLeftPress}
          text=''
          icon={
            <Icon
              name={leftIconName}
              size={15}
              color='white'
            />
          }
        />}
        centerComponent={{ text: title, style: { fontSize: 17, color: '#fff' } }}
        rightComponent={<Button
          onPress={this._onRightPress}
          text=''
          loading={loading}
          icon={
            <Icon
              name={rightIconName}
              size={15}
              color='white'
            />
          }
          iconRight
        />}
      />
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

const styles = {
  innerContainer: {
    height: 80
  },
  buttonIcon: {
    margin: 0,
    padding: 0,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainHeader)