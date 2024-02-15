const express = require('express')
const Authantication = require('../Middleware/Authtoken')
const route = express()

route.post('/sendmessage', Authantication, async(req, res) => {
    
})

module.exports = route