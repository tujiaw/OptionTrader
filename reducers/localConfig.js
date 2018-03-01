import { UPDATE_LOCAL_CONFIG } from '../constants/actionTypes'

const initData = {
    wsip: '47.100.7.224',
    wsport: '55555',
    codeList: ['IC1803', 'IF1803', 'IH1803', 'i1805']
}

export default function localConfig(state = initData, action) {
  switch(action.type) {
    case UPDATE_LOCAL_CONFIG:
    {
      return Object.assign({}, state, action.data)
    }
    default:
      return state
  }
}
