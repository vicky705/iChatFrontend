import React, { useEffect, useRef, useState } from 'react'
import Usercard from './Usercard'
import { getAllUsers, sendMessage } from '../../Redux/ApiHandler'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessageToStore, setUsers } from '../../Redux/messageSlice'
import Sendtext from './Messagebox/Sendtext'
import Recievetext from './Messagebox/Recievetext'
import {io} from 'socket.io-client'

const Chatarea = () => {
  const authToken = useSelector(state => state.authToken.data)
  const users = useSelector(state => state.users.data)
  const profile = useSelector(state => state.profile.data)
  const messageList = useSelector(state => state.message.data)
  const selectedUser = useSelector(state => state.selectUser.data)
  const [messageText, setMessageText] = useState('')
  const socket = useRef()
  const [onlineUser, setOnlineUser] = useState([])
  const dispatch = useDispatch()
  const chatSectionRef = useRef(null)

  const getAllUserHandler = async() => {
    const data = await getAllUsers(authToken)
    if(data.status){
      dispatch(setUsers(data.users))
    }
  }

  useEffect(() => {
    getAllUserHandler()
  }, [])

  const scrollToBottom = () => {
    if (chatSectionRef.current) {
      setTimeout(() => {
        chatSectionRef.current.scrollTop = chatSectionRef.current.scrollHeight;
      }, 100)
    }
  };

  useEffect(() => {
    scrollToBottom()
  }, [selectedUser])

  // Web socket io 
  

  
  useEffect(() => {
    if(profile !== undefined){
      console.log("Connecting to socket server")
      socket.current = io('http://localhost:8800')
      socket.current.emit('action:newUserAdd', selectedUser._id)
      socket.current.on('action:getActiveUser', (users) => {
        setOnlineUser(users)
        console.log("Client Side Active User", users)
      })
    }
  }, [profile])

  

  useEffect(() => {
    socket.current.on('action:messageRecieve', async(data) => {
      if(data.message.recieverId === profile._id){
        const val = await data.message
        dispatch(sendMessageToStore(val))
        console.log("Message Recived", val)
        scrollToBottom()
      }
    })
  }, [])


  const onSumbitMessageHandeler = async(event) => {
    event.preventDefault()
    const response = await sendMessage(authToken, {recieverId : selectedUser._id, message : messageText})
    if(response.status){
      dispatch(sendMessageToStore(response.text))
      scrollToBottom()
    }
    setMessageText('')
    const rId = onlineUser.find((item) => item.userId === selectedUser._id)
    console.log()
    socket.current.emit('action:sendMessage', {message : response.text, reciverSocketId : rId.socketId})
  }



  return (
    <div className='chat-area'>
      <div className="user">
        {
          users.map((item) => {
            return (
              profile._id !== item._id && <Usercard key={item._id} data={item}/>
            )
          })
        }
      </div>
      <div className="chat">
        {selectedUser.email && <div className='title'>
          <img src='https://www.nicepng.com/png/detail/856-8561250_profile-pic-circle-girl.png' />
          <p className='name'>{selectedUser.email}</p>
        </div>}
        <div className='chat-section' ref={chatSectionRef}>
          { 
            messageList.map((item) => {
              return (
                item.senderId === profile._id ? <Sendtext key={item._id} data={item} /> : <Recievetext key={item._id} data={item} />
              )
            })
          }
        </div>
        {selectedUser.email && <div className="send-message">
          <form onSubmit={e => onSumbitMessageHandeler(e)}>
            <input type='text' name='message' placeholder='Message...' className='message-box' value={messageText} onChange={e => setMessageText(e.target.value)}/>
            <button type='submit'>send</button>
          </form>
        </div>}
      </div>
    </div>
  )
}

export default Chatarea
