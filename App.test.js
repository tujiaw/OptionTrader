var _ = require('lodash')

const x = (255 << 20 | 1)
console.log(x)

const xx = undefined
if (!xx) {
    console.log('xxxxxxxxxxxxxxxx')
}