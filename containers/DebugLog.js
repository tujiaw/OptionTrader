import React from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import { Button, Overlay, Input } from 'react-native-elements'
import { connect } from 'react-redux'
import controller from '../controller'

class DebugLog extends React.Component {
  state = {
  }

  componentDidMount() {
  }

  _onClose = () => {
    this.props.onChanged('close')
  }

  _renderItem = ({item}) => {
    return ( <Text>{item}</Text>)
  }

  render() {
    return (
      <Overlay 
        isVisible={this.props.isVisible}
        width="100%"
        style={styles.root}
      >
        <FlatList
          renderItem={this._renderItem}
          keyExtractor={(item, index) => String(index)}
          data={this.props.list}
        />
      </Overlay>
    )
  }
}

function mapStateToProps(state) {
  return {
    list: state.debugLogData
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const styles = {
  root: {
    zIndex: 10000,
    height: 300
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DebugLog)