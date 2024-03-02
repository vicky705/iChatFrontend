const express = require('express')
const connectToMongose = require('./Config/config')
const {Server} = require('socket.io')
const {createServer} = require('http')

const app = express()

const cors = require('cors')
const POST = 4000
connectToMongose()

const server = new createServer(app)
const io = new Server(server, {
    cors : {
        origin : "*"
    }
})

const activeUser = {}

io.on("connection", (socket) => {
    console.log("New user connected")

    socket.on('action:join', (user) => {
        const account = user
        account["socketId"] = socket.id
        if(!activeUser[user._id]){
            activeUser[user._id] = account
        }
        console.log(account)
        io.emit("action:activeUser", activeUser)
    })

    socket.on("action:sendMessage", (message) => {
        if(activeUser[message.recieverId]){
            console.log("socket Id ", activeUser[message.recieverId].socketId)
            io.to(activeUser[message.recieverId].socketId).emit("action:recieveMessage", message)
        }
        else console.log("user is offline")
        console.log("Recieve message", message)
    })

    socket.on('disconnect', () => {
        const disconnectedUserId = Object.keys(activeUser).find((item) => activeUser[item].socketId === socket.id)
        if(activeUser[disconnectedUserId]){
            delete activeUser[disconnectedUserId]
            io.emit('action:activeUser', activeUser)
        }
    })
})




app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./Controller/Usercontroller'))
app.use('/api/message', require('./Controller/Messagecontroller'))
app.use('/api/user', require('./Usercontroller/User'))


server.listen(POST, () => {
    console.log(`Backend server start at https://localhost:${POST}`)
})