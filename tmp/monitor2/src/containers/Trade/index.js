import React, { Component } from 'react'
import { tradeLogin,
  startWebSocket, 
  closeWebSocket,
  login,
  subAccount
} from '../../databus'

class Trade extends React.Component {
  state = {
    result: '',
    error: '',
  }

  onLoginBus = () => {
    startWebSocket()
    .then(() => {
      return login('admin', 'admin')
    })
    .then((json) => {
      this.setState({ result: JSON.stringify(json) })
    })
    .catch((err) => {
      this.setState({ result: JSON.stringify(err) })
    })
  }

  onLoginTrade = () => {
    console.log('login request')
    tradeLogin().then((json) => {
      this.setState({ result: JSON.stringify(json) })
    }).catch((err) => {
      this.setState({ result: JSON.stringify(err) })
    })
  }

  onSubAccount = () => {
    subAccount().then((json) => {
      this.setState({ result: JSON.stringify(json) })
    }).catch((err) => {
      this.setState({ result: JSON.stringify(err) })
    })
  }

  onClearResult = () => {
    this.setState({ result: '' })
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={this.onLoginBus}>login bus</button>
          <button onClick={this.onLoginTrade}>login trade</button>
          <button onClick={this.onSubAccount}>sub account</button>
          <button onClick={this.onClearResult}>clear</button>
        </div>
        <div>
          <span>login result:</span><br/>
          <span>{this.state.result}</span>
        </div>
      </div>
    )
  }
}


export default Trade