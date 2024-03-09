import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile : {
        data : {},
    },
    authToken : {
        data : ''
    },
    users : {
        data : [],
        isLoading : true,
        userList : []
    },
    message : {
        data : [],
        idLoading : true
    },
    selectUser : {
        data : {}
    }
}

export const messageSlice = createSlice({
    name : "message",
    initialState,
    reducers : {
        setAuthToken : (state, action) => {
            state.authToken.data = action.payload
        },
        setProfile : (state, action) => {
            state.profile.data = action.payload
        },
        setUsers : (state, action) => {
            state.users.data = action.payload
            state.users.userList = action.payload
        },
        setMessage : (state, action) => {
            state.message.data = action.payload
        },
        selectUsers : (state, action) => {
            state.selectUser.data = state.users.data.filter((item) => item._id === action.payload)[0]
        },
        sendMessageToStore : (state, action) => {
            state.message.data.push(action.payload)
        },
        searchUser : (state, action) => {
            state.users.userList = state.users.data.filter((item) => item.name.toLowerCase().includes(action.payload.toLowerCase()))
        }
    }
})

export const { setProfile, setAuthToken, setUsers, setMessage, selectUsers, sendMessageToStore, searchUser } = messageSlice.actions

export default messageSlice.reducer