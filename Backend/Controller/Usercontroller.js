const express = require('express')
const route = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const Usermodel = require('../Model/Usermodel')
const JWT_SECRITE = "This is vicky"

route.post('/createuser', async(req, res) => {
    let status = false
    try{
        const data = req.body
        const isUser = await Usermodel.findOne({email : data.email})
        if(isUser) return res.status(400).json({status, message : "Email is already exist."})
        console.log("gen salt")
        const salt = bcrypt.genSaltSync(10)
        console.log(salt)
        const newPass = await bcrypt.hash(data.password, salt)
        data.password = newPass
        console.log(data)
        const user = await Usermodel.create(data)
        const userId = {
            userId : user._id
        }
        const authToken = jwt.sign(userId, JWT_SECRITE)
        status = true
        res.status(200).json({status, message : "User Registration Successfully.", user, authToken})
    }
    catch(err){
        res.status(500).json({status, message : err.toString()})
    }
})

route.post('/login', async(req, res) => {
    let status = false
    try{
        const data = req.body
        const isUser = await Usermodel.findOne({email : data.email})
        if(!isUser) return res.status(404).json({status, message : "Invalid Cradiential."})

        const isPass = await bcrypt.compare(data.password, isUser.password)
        if(!isPass) return res.status(404).json({status, message : "Invalid Cradiential."})
        const userId = {
            userId : isUser._id
        }
        const authToken = jwt.sign(userId, JWT_SECRITE)
        status = true
        return res.status(200).json({status, message : "Login Successfully.", user : isUser, authToken})
    }
    catch(err){
        res.status(500).json({status, message : err.toString()})
    }
})

module.exports = route