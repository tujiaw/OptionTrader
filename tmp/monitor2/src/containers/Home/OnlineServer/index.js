import React, { Component } from 'react';
import { Tabs, Input, Icon } from 'antd';
import RealtimePage from './RealtimePage'
import HistoryPage from './HistoryPage'
import { connect } from 'react-redux'
import * as filterinfoAction from '../../../actions/filterinfoAction'
const { TabPane } = Tabs;

const TAB_LIST = [
  { tab: '服务实时数据', key: '0', component: <RealtimePage/> },
  { tab: '服务历史数据', key: '1', component: <HistoryPage/> },
]

const operations = (onSearch) => (
  <div>
    <Input placeholder="输入UUID搜索" prefix={<Icon type="search" />} onChange={ e => onSearch(e.target.value )}/>
  </div>
)

class OnlineServer extends Component {
  state = { 
    activeKey: '0'
  }

  onChange = (key) => {
    this.setState({ activeKey: key })
    const item = TAB_LIST.find((item) => {
      return item.key === key
    })
    if (item && this.props.onTabChanged) {
      this.props.onTabChanged(item)
    }
  }

  onSearch = (text) => {
    this.props.updateFilter('OnlineServer', text)
  }

  render() {
    const { windowinfo } = this.props
    const pageWidth = windowinfo.width - windowinfo.siderWidth - 20  // 20边距

    return (
      <Tabs tabBarExtraContent={operations(this.onSearch)} 
        activeKey={this.state.activeKey} 
        onChange={this.onChange}
        style={{background: '#fff', margin: 10, borderRadius: 5, width: pageWidth}}
      >
        {TAB_LIST.map((item) => {
          return <TabPane tab={item.tab} key={item.key}>{item.component}</TabPane>  
        })}
      </Tabs>
    );
  }
}

////////////////////////////////////////////////////////////////////
function mapStateToProps(state) {
  return { 
    windowinfo: state.windowinfo,
  }
}

function mapDispatchToProps(dispatch) {
  return { 
    updateFilter: function(name, text) {
      dispatch(filterinfoAction.update({ 'name': name, 'text': text }))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnlineServer)