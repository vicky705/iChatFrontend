const mongoose = require('mongoose')
const dburl = "mongodb+srv://vickykumar776655:6pVfrz4i8hjnTMMF@cluster0.oacj9k4.mongodb.net/iChat?retryWrites=true&w=majority"

const connectToMongose = () => {
    mongoose.connect(dburl).then(() => {
        console.log("Connected.")
    }).catch((error) => {
        console.log(error)
    })
}

module.exports = connectToMongose