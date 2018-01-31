import React from 'react'
import { StyleSheet, View, Text, SectionList } from 'react-native'
import { connect } from 'react-redux'
import MainHeader from '../components/MainHeader'
import MarketItem from '../components/MarketItem'
import OrderItem from '../components/OrderItem'

class Show extends React.Component {
  state = {
    mainHeaderData: {},
    dataList: [
      {
        title: '市场',
        data: [{
          key: 1,
          code: 'IC1892',
          dBidPrice1: '3434.5',
          nBidVolume1: '3000',
        }]
      },
      {
        title: '成交',
        data: [{
          key: 1,
          ordertime: '20180130',
          nOrderID: 'aaa',
          nOrderSysID: 'bbb'
        }]
      }
    ]
  }

  _renderItem = ({item}) => {
    console.log(item)
    if (item.dBidPrice1) {
      return (
        <MarketItem key={item.key} data={item} />
      )
    } else {
      return (
        <OrderItem />
      )
    }
  }

  render() {
    return (
      <View style={styles.root}>
        <MainHeader data={this.state.mainHeaderData} />
        <SectionList
          style={styles.list}
          renderItem={this._renderItem}
          renderSectionHeader={({section}) => <Text>{section.title}</Text>}
          sections={this.state.dataList}
        />
      </View>
    )        
  }
}

function mapStateToProps(state) {
  return {capitalStateData: state.capitalStateData}
}

function mapDispatchToProps(dispatch) {
  return {}
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 22
  },
  list: {
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Show)