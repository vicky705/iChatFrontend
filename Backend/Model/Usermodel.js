const mongoos = require('mongoose')
const {Schema} = mongoos

const UserSchema = new Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    profile : {
        type : String
    },
    createDate : {
        type : Date
    }
})

module.exports = mongoos.model("Users", UserSchema)