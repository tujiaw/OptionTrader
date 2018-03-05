var _ = require('lodash')

const x = {'1': '111', '2': '222', '3': '333'}

_.each(x, value => {
    console.log(value)
})