const express = require('express')
const Authantication = require('../Middleware/Authtoken')
const Usermodel = require('../Model/Usermodel')
const route = express()

route.get('/getAllUser', Authantication, async(req, res) => {
    let status = false
    try{
        const users = await Usermodel.find({},{password:0})
        if(!users) return res.status(404).json({status, message : 'Userlist is empty.'})
        status = true
        res.status(200).json({status, users})
    }
    catch(err){
        res.status(500).json({status, message : err.toString()})
    }
})

route.get('/getProfile', Authantication, async(req, res) => {
    let status = false
    try{
        const user = await Usermodel.findById({_id : req.id}, {password : 0})
        if(!user) return res.status(404).json({status, message : "Profile Not found."})
        status = true
        return res.status(200).json({status, user})
    }
    catch(err){
        res.status(500).json({status, message : err.toString()})
    }
})

module.exports = route