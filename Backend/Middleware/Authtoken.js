const jwt = require('jsonwebtoken')
const JWT_SECRITE = "This is vicky"

const Authantication = async(req, res, next) => {
    let status = false
    try{
        const token = req.header('authToken')
        if(!token) return res.status(401).json({status, message : "Invalid Authantication."})
        const data = await jwt.verify(token, JWT_SECRITE)
        req.id = data._id
        next()
    }
    catch(err){
        res.status(500).json({status, message : err.toString()})
    }
}

module.exports = Authantication