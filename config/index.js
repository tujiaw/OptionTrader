import { CONNECT_STATUS } from '../constants'

const defaultConfig = {
    wsip: '47.100.7.224',
    wsport: '55555',
    codeList: ['IC1803', 'IF1803', 'IH1803', 'i1805'],
    username: 'admin',
    password: 'admin',
    netStatus: CONNECT_STATUS.CONNECTING,
    lock: 'unlock'
}

export default defaultConfig