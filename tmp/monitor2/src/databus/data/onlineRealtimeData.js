import * as onlineServerAction from '../../actions/onlineServerAction'
import store from '../../utils/store'

// 数据结构
// let realtimeStatus = {
//     key: '1',
//     broker: 'mainbroker',
//     uuid: 'bridgetb2',
//     address: '3234',
//     sendreq_recvres: '3432212/4354',
//     recvreq_sendres: '3222254/4222',
//     sendpub_recvpub: '2322/435',
//     sendqueue_recvqueue: '325/0',
//     heartbeat: '2017-08-06 17:34:03',
//     name: 'broker1',
//     id: '1,2,3,4',
//     ip: '127.0.0.1',
//     signin_time: '2017-08-06 17:34:03',
//     start_time: '2017-08-06 17:34:03'
// }

export const onlineRealtimeData = (function() {
	let data = {}
	const obj = {
		addrstr: function(addr) {
			if (!addr) {
				return ''
			}
			let addrstr = ''
			if (typeof addr === 'number' && addr > 0) {
				addrstr = String(addr)
			} else if (typeof addr === 'string'){
				addrstr = addr
			}
			return addrstr
		},
		initItem: function(addr) {
			const str = this.addrstr(addr)
			if (str.length) {
				if (!data[str]) {
					data[str] = {
						sendreq_recvres: '0/0',
						recvreq_sendres: '0/0',
						sendpub_recvpub: '0/0',
						sendqueue_recvqueue: '0/0'
					}
				}
				return true
			}
			return false
		},
		update: function(addr, key, value) {
			const str = this.addrstr(addr)
			if (this.initItem(str)) {
				data[str][key] = value
			}
		},
		removeFromUUID: function(uuid) {
			if (uuid && uuid.length) {
				for (const key in data) {
					if (data[key].uuid === uuid) {
						delete data[key]
					}
				}
			}
		},
		getTopoinfoFromUUID: function(uuid) {
			let result = []
			if (uuid && uuid.length) {
				for (const key in data) {
					if (data[key].uuid === uuid) {
						result.push({
							'uuid': uuid,
							'broker': data[key].broker,
							'serviceid': data[key].id,
						})
					}
				}
			}
		},
		toTopoArray: function() {
			let result = []
			for (const key in data) {
				result.push({
					uuid: data[key].uuid,
					broker: data[key].broker
				})
			}
			return result
		},
		dispatch: function() {
			let realtimeStatusList = []
			for (const key in data) {
				if (data[key].key && data[key].key.length) {
					realtimeStatusList.push(data[key])
				}
			}
			store.dispatch(onlineServerAction.update(realtimeStatusList))
		}
	}
	return obj
}())
