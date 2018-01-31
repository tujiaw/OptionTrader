import React from 'react';
import { Breadcrumb } from 'antd';

const NavBar = (props) => (
  <Breadcrumb>
    {props.list.map((item, index) => {
      return <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>  
    })}
  </Breadcrumb>
)

export default NavBar