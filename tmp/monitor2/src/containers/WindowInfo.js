import React from 'react';
import { connect } from 'react-redux'
import * as windowinfoAction from '../actions/windowinfoAction'
import { debounce } from '../utils/tools'

// 侧边栏宽度
export const SIDER_WIDTH = 200
// 侧边栏收起宽度
export const SIDER_COLLAPSED_WIDTH = 64

const debounceUpdate = debounce(function(self) {
  let siderWidth = 0
  if (self.props.collapsed !== undefined) {
    siderWidth = self.props.collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH
  }
  self.props.udpateWindowinfo({
    siderWidth,
    width: window.innerWidth,
    height: window.innerHeight,
  })
}, 30);

class EmptyWindowContainer extends React.Component {
  onResize = () => {
    debounceUpdate(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.collapsed !== nextProps.collapsed) {
      debounceUpdate(this)
    }
  }
  
  componentDidMount() {
    debounceUpdate(this)
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  render() {
    return ( null );
  }
}

////////////////////////////////////////////////////////////////////
function mapStateToProps(state) {
  return { }
}

function mapDispatchToProps(dispatch) {
  return {
    udpateWindowinfo: (data) => {
      dispatch(windowinfoAction.update(data))
    }
  }
}

export const EmptyWindow = connect(mapStateToProps, mapDispatchToProps)(EmptyWindowContainer)