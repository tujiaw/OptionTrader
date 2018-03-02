import React from 'react'
import { Header } from 'react-native-elements'
import { CONNECT_STATUS } from '../constants'
import { connect } from 'react-redux'

class MainHeader extends React.Component {
  render() {
    const { netStatus } = this.props.localConfig
    let netStatusText = '已断开'
    if (netStatus === CONNECT_STATUS.CONNECTING) {
      netStatusText = '连接中...'
    } else if (netStatus === CONNECT_STATUS.OPEN) {
      netStatusText = '已连接'
    } else if (netStatus === CONNECT_STATUS.CLOSING) {
      netStatusText = '连接关闭中...'
    }

    return (
      <Header
      outerContainerStyles={styles.innerContainer}
        leftComponent={{ icon: 'menu', color: '#fff' }}
        centerComponent={{ text: netStatusText, style: { color: '#fff' } }}
        rightComponent={{ icon: 'home', color: '#fff' }}
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainHeader)