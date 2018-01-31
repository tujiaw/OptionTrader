import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import { Layout, Row, Col, Button, Tooltip, Icon } from 'antd';

import Style from './style'
import history from '../../utils/history'
import FunctionList from '../../components/FunctionList'
import NavBar from '../../components/NavBar'
import Spacer from '../../components/Spacer'
import ResetPassword from '../ResetPassword'
import OnlineServer from './OnlineServer'
import TopologicalGraph from './TopologicalGraph'
import * as WindowInfo from '../WindowInfo'

const { Header, Content, Sider } = Layout;

const FUNCTION_LIST = [
  { key: '0', icon: 'database', text: '服务在线', path: '/monitor/online', component: OnlineServer },
  { key: '1', icon: 'fork', text: '服务拓扑图', path: '/monitor/topologicalgraph', component: TopologicalGraph },
]

class Home extends Component {
  state = {
    collapsed: false,
    navBar: [],
  }

  onToggle = () => {
    this.setState({ collapsed: !this.state.collapsed })
  } 

  onLockClick = () => {

  }

  onLogoutClick = () => {
    history.push('/')
  }

  onSelectChanged = (index) => {
    const item = FUNCTION_LIST.find(item => {
      return item.key === index
    })
    if (item) {
      history.push(item.path)
      this.setState({ navBar: [item.text] })
    }
  }

  render() {
    return (
      <Layout style={Style.root}>
        <WindowInfo.EmptyWindow collapsed={this.state.collapsed} />
        <Header>
          <Row type="flex" justify="space-between">
            <Col><span style={Style.title}>MONITOR</span></Col>
            <Col>
              <Row type="flex" align="middle">
                <ResetPassword /><Spacer width={16} />
                <Tooltip placement="topLeft" title="退出">
                  <Button ghost={true}  shape="circle" icon="logout" onClick={this.onLogoutClick} />
                </Tooltip>
              </Row>
            </Col>
          </Row>
        </Header>
        <Layout>
          <Sider trigger={null} 
            collapsible collapsed={this.state.collapsed}
            width={WindowInfo.SIDER_WIDTH}
            collapsedWidth={WindowInfo.SIDER_COLLAPSED_WIDTH}
          >
            <FunctionList defaultKey={FUNCTION_LIST[0].key} onSelectChanged={this.onSelectChanged} list={FUNCTION_LIST}/>
          </Sider>
          <Content >
            <Row style={Style.navbar}>
                <Icon className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.onToggle}
                />
                <NavBar list={this.state.navBar}/>
            </Row>
            <Row>
              {FUNCTION_LIST.map((item, index) => {
                return <Route key={index} path={item.path} component={item.component} />
              })}
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Home