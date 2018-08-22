import { CONNECT_STATUS } from '../constants'

const defaultConfig = {
    wsip: '47.100.7.224',
    wsport: '8080', // '55555'
    codeList: ['i1810'],
    username: 'admin',
    password: 'admin',
    netStatus: CONNECT_STATUS.CONNECTING,
    lock: 'unlock'
}

export default defaultConfig