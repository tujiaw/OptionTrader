import React, { Component } from 'react';

class TopologicalGraph extends Component {
  render() {
    return (
        <iframe src="./topo/" title="topo" style={{
          name: 'topo',
          margin: 10, 
          width: 3000,
          height: 3000,
          frameborder: 'no',
          border: 0,
          scrolling: 'no',
        }} /> 
    );
  }
}

export default TopologicalGraph
