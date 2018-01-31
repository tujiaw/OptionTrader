import React from 'react';

const Spacer = (props) => (
  <div 
    style={{
      width: props.width !== undefined ? props.width : 8, 
      height: props.height !== undefined ? props.height: 8,
    }}>
  </div>
)

export default Spacer