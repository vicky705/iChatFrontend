const {Server} = require('socket.io')

const io = new Server(8800, {
    cors: {
      origin: '*',
    }
  });

const activeUsers = []

io.on('connection', (socket) => {
    console.log("socket connnected")
    socket.on('action:newUserAdd', (newUserId) => {
      if(!activeUsers.some((item) => item.userId === newUserId) && newUserId){
        activeUsers.push({
          userId : newUserId,
          socketId : socket.id
        })
      }
      // console.log("Form Socket server ", activeUsers)
      socket.emit('action:getActiveUser', activeUsers)
    })
    socket.on('action:sendMessage', (data) => {
      console.log(data.reciverSocketId)
      io.emit("action:messageRecieve", data)
    })
    socket.on('disonnected', () => {

    })
})
