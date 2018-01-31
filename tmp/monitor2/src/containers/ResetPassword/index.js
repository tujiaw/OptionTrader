import React, { Component } from 'react';
import { Modal, Tooltip, Button, Input, Icon } from 'antd';
import Style from './style'
import {tradeLogin} from '../../databus'

class Resetlock extends Component {
  state = { 
    visible: false,
    errmsg: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  showModal = () => {
    // this.setState({
    //   errmsg: '',
    //   visible: true,
    // });
    tradeLogin()
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  }

  onConfirm = () => {
    let { oldPassword, newPassword, confirmPassword } = this.state
    if (oldPassword.trim().length === 0 || newPassword.trim().length === 0 || confirmPassword.trim().length === 0) {
      this.setState({ errmsg: '输入的密码不能为空！'})
      return
    }

    if (newPassword !== confirmPassword) {
      this.setState({ errmsg: '两次输入的新密码不一致！'})
      return
    }

    this.hideModal()
  }

  onOldPasswordChange = (e) => {
    this.setState({ oldPassword: e.target.value })
  }

  onNewPasswordChange = (e) => {
    this.setState({ newPassword: e.target.value })
  }

  onConfirmPasswordChange = (e) => {
    this.setState({ confirmPassword: e.target.value })
  }

  render() {
    return (
      <div>
        <Tooltip placement="topLeft" title="重设密码">
          <Button ghost={true} shape="circle" icon="lock" onClick={this.showModal} />
        </Tooltip>
        <Modal
          title="修改密码"
          visible={this.state.visible}
          onOk={this.onConfirm}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
          width="400"
        >
        <div style={Style.row}>
          <span style={Style.text}>旧密码</span>
          <Input prefix={<Icon type="lock" />} type="password" value={this.state.oldPassword} onChange={this.onOldPasswordChange}/>    
        </div>
        <div style={Style.row}>
          <span style={Style.text}>新密码</span>
          <Input prefix={<Icon type="lock" />} type="password" value={this.state.newPassword} onChange={this.onNewPasswordChange}/>    
        </div>
        <div style={Style.row}>
          <span style={Style.text}>确认密码</span>
          <Input prefix={<Icon type="lock" />} type="password" value={this.state.confirmPassword} onChange={this.onConfirmPasswordChange}/>
        </div>
        <div style={Style.row}>
          <span style={Style.errmsg}>{this.state.errmsg}</span>
        </div>
        </Modal>
      </div>
    );
  }
}

export default Resetlock;