const mongoos = require('mongoose')
const { Schema } = mongoos

const MessageSchema = new Schema({
    senderId : {
        type : Schema.ObjectId
    },
    recieverId : {
        type : Schema.ObjectId
    },
    message : {
        type : String
    },
    createDate : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoos.model('Message', MessageSchema)