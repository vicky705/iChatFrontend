const express = require('express')
const connectToMongose = require('./Config/config')

const app = express()
const cors = require('cors')
const POST = 4000
connectToMongose()

app.use(cors())
app.use(express.json())

app.use('/api/user', require('./Controller/Usercontroller'))
app.use('/api/message', require('./Controller/Messagecontroller'))

app.listen(POST, () => {
    console.log(`Backend server start at https://localhost:${POST}`)
})