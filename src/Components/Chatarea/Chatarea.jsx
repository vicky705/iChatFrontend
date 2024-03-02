import React, { useDeferredValue, useEffect, useRef, useState } from 'react'
import Usercard from './Usercard'
import { getAllUsers, sendMessage } from '../../Redux/ApiHandler'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessageToStore, setUsers } from '../../Redux/messageSlice'
import Sendtext from './Messagebox/Sendtext'
import Recievetext from './Messagebox/Recievetext'
import {io} from 'socket.io-client'
const socket = io('http://localhost:4000')

const Chatarea = () => {
  const authToken = useSelector(state => state.authToken.data)
  const users = useSelector(state => state.users.data)
  const profile = useSelector(state => state.profile.data)
  const messageList = useSelector(state => state.message.data)
  const selectedUser = useSelector(state => state.selectUser.data)
  const [messageText, setMessageText] = useState('')
  const [onlineUser, setOnlineUser] = useState([])
  const dispatch = useDispatch()
  const chatSectionRef = useRef(null)
  const [activeUser, setActiveUser] = useState({})


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
      socket.emit('action:join', profile)
      socket.on('action:activeUser', (info) => {
        console.log("Connected user", info)
        setActiveUser(info)
      })
      socket.on("action:recieveMessage", (message) => {
        console.log("Recieved message", message)
        dispatch(sendMessageToStore(message))
        scrollToBottom()
      })
  }, [])
  

  const sendMessageToSocket = (msg) => {
    socket.emit("action:sendMessage", msg)
  }


  const onSumbitMessageHandeler = async(event) => {
    event.preventDefault()
    if(messageText.trim().length > 0){
      const response = await sendMessage(authToken, {recieverId : selectedUser._id, message : messageText})
      if(response.status){
        dispatch(sendMessageToStore(response.text))
        scrollToBottom()
        sendMessageToSocket(response.text)
      }
      setMessageText('')
    }
  }

  return (
    <div className='chat-area'>
      <div className="user">
        {
          users.map((item) => {
            return (
              profile._id !== item._id && <Usercard key={item._id} data={item} isActive={activeUser[item._id] ? true : false}/>
            )
          })
        }
      </div>
      <div className="chat">
        {selectedUser.email && <div className='title'>
          <img src='https://www.nicepng.com/png/detail/856-8561250_profile-pic-circle-girl.png' />
          <p className='name'>
            <div>{selectedUser.email}</div>
            <div style={{color: "#00b81f"}}> {activeUser[selectedUser._id] ? "Online" : ""}</div>
          </p>
        </div>}
        <div className='chat-section' ref={chatSectionRef}>
          { 
            messageList.map((item) => {
              return (
                item.senderId === profile._id ? <Sendtext key={item._id} data={item}/> : <Recievetext key={item._id} data={item} />
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
