const express = require('express')
const Authantication = require('../Middleware/Authtoken')
const Messagemodel = require('../Model/Messagemodel')
const route = express()

route.post('/sendmessage', Authantication, async(req, res) => {
    let status = false
    console.log(req.id)
    try{
        req.body.senderId = req.id
        const messageText = await Messagemodel.create(req.body)
        if(!messageText) return res.status(400).json({status, message : "Bed request."})
        status = true
        return res.status(200).json({status, message : "Message sended.", text : messageText})
    }
    catch(err){
        res.status(500).json({status, message : err.toString()})
    }
})

route.post('/getAllMessage', Authantication, async(req, res) => {
    let status = false
    
    try{
        const senderIdText = req.id
        const recieverIdText = req.body.recieverId

        const messageList = await Messagemodel.find({
            $or : [
                {senderId : senderIdText, recieverId : recieverIdText},
                {senderId : recieverIdText, recieverId : senderIdText}
            ]
        })
        if(!messageList) return res.status(404).json({status, message : "Message is empty."})
        status = true
        return res.status(200).json({status, messageList })
    }
    catch(err){
        res.status(500).json({status, message : err.toString()})
        res.status(500).json({status, message : err.toString()})
    }
})

module.exports = route