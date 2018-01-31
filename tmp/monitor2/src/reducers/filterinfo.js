import { UPDATE_FILTER_INFO } from '../constants/actionTypes'

const initData = {
  name: '',   // 哪个页面，页面名字
  text: ''    // 过滤的文本
}

export default function filterinfo(state = initData, action) {
  switch(action.type) {
    case UPDATE_FILTER_INFO:
      return { ...action.data }
    default:
      return state
  }
}
