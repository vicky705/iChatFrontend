import React from "react"

const BASE_URL = "http://localhost:4000"



export const registerUser = async(info) => {
    const response = await fetch(`${BASE_URL}/api/auth/createuser`, {
        method : "post",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(info)
    })   
    
    const data =  await response.json()
    if(data.status){
        localStorage.setItem('authToken', data.authToken)
    }
    return data
}


export const loginUser = async(user) => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method : "post",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(user)
    })
    const data = await response.json()
    if(data.status){
        localStorage.setItem('authToken', data.authToken)
    }
    return data
} 

export const getProfile = async(authToken) => {
    const response = await fetch(`${BASE_URL}/api/user/getProfile`, {
        method : "get",
        headers : {
            "Content-Type" : "application/json",
            "authToken" : authToken
        }
    })
    const data = await response.json()
    if(!data.status){
        localStorage.removeItem('authToken')
    }
    return data
}

export const getAllUsers = async(authToken) => {
    const response = await fetch(`${BASE_URL}/api/user/getAllUser`, {
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
            "authToken" : authToken
        }
    })
    return await response.json()
}

export const getAllMessage = async(authToken, id) => {
    const response = await fetch(`${BASE_URL}/api/message/getAllMessage`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
            "authToken" : authToken
        },
        body : JSON.stringify({"recieverId" : id})
    })
    return await response.json()
}

export const sendMessage = async(authToken, msg) => {
    const formData = new FormData()
    formData.append('recieverId', msg.recieverId)
    formData.append('message', msg.message)
    formData.append('file', msg.file)
    const response = await fetch(`${BASE_URL}/api/message/sendmessage`, {
        method : "POST",
        headers : {
            'authToken' : authToken
        },
        body : formData,
    })
    return await response.json()
}
