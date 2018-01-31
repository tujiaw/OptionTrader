import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Layout, Row, Col } from 'antd';
import Style from './style'
import localStore from '../../utils/localStore'
import { startWebSocket, closeWebSocket, login } from '../../databus'

const FormItem = Form.Item;
class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    isremember: false,
  }

  componentDidMount() {
    closeWebSocket()
    const name = localStore.getItem('username') || ''
    const pass = localStore.getItem('password') || ''
    if (name.length && pass.length) {
      this.setState({
        username: name,
        password: pass,
        isremember: true,
      })

      const { setFieldsValue } = this.props.form
      setFieldsValue({ username: name })
      setFieldsValue({ password: pass })
      setFieldsValue({ remember: true })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('Received values of form: ', values);
        return;
      }
      
      if (values.username === 'admin' && values.password === 'admin') {
        startWebSocket()
        .then(() => {
          return login(values.username, values.password)
        })
        .then((res) => {
          localStore.setItem('username', this.state.isremember ? values.username : '')
          localStore.setItem('password', this.state.isremember ? values.password : '')
          this.props.history.push('/monitor')
          //this.props.history.push('/trade')
        }).catch(err => {
          console.error('login failed,' + err)
        })
      }
    });
  }

  onCheckChange = (e) => {
    this.setState({ isremember: e.target.checked })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Layout style={Style.layout}>
        <Row type="flex" justify="center" align="middle" style={Style.row}>
          <Col>
            <Form onSubmit={this.handleSubmit} style={Style.form}>
              <FormItem>
                <span style={Style.title}>Sign in to Monitor</span>
              </FormItem>
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入用户名！' }],
                })(
                  <Input prefix={<Icon type="user" />} placeholder="用户名"/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码！' }],
                })(
                  <Input prefix={<Icon type="lock" />} type="password" placeholder="密码"/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: false,
                })(
                  <Checkbox onChange={this.onCheckChange}>记住密码</Checkbox>
                )}
                <Layout>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    登录
                  </Button>
                </Layout>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </Layout>
    );
  }
}

const Login = Form.create()(LoginForm);
export default Login