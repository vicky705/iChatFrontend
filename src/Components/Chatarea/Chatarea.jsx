import React, { useDeferredValue, useEffect, useRef, useState } from 'react'
import Usercard from './Usercard'
import { getAllUsers, sendMessage } from '../../Redux/ApiHandler'
import { useDispatch, useSelector } from 'react-redux'
import { searchUser, sendMessageToStore, setUsers } from '../../Redux/messageSlice'
import Sendtext from './Messagebox/Sendtext'
import Recievetext from './Messagebox/Recievetext'
import {io} from 'socket.io-client'
import Welcome from './Welcome'
import Fileselctor from './Fileselctor'
import Sendfile from './Messagebox/Sendfile'
import Recieverfile from './Messagebox/Recieverfile'
// const socket = io('http://localhost:4000')
const socket = io('https://ichatbackend-jvya.onrender.com')

const Chatarea = ({isProfileOpen, setIsProfileOpen, isLeft}) => {
  const authToken = useSelector(state => state.authToken.data)
  const users = useSelector(state => state.users.userList)
  const profile = useSelector(state => state.profile.data)
  const messageList = useSelector(state => state.message.data)
  const selectedUser = useSelector(state => state.selectUser.data)
  const [messageText, setMessageText] = useState('')
  const dispatch = useDispatch()
  const chatSectionRef = useRef(null)
  const [activeUser, setActiveUser] = useState({})
  const [search, setSearch] = useState('')
  const [isFileSelector, setIsFileSelector] = useState(false)
  const [isFile, setIsFile] = useState()

  const [imageType, setImageType] = useState(["apng","avif","gif","jpg","jpeg","jfif","pjpeg","pjp","png","webp"])
  


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
    const eventFire = event.target[1].name
    if(eventFire === "text" && messageText.trim().length <= 0) return
    const response = await sendMessage(authToken, {recieverId : selectedUser._id, message : messageText, file : isFile})
    console.log(response)
    if(response.status){
      dispatch(sendMessageToStore(response.text))
      scrollToBottom()
      sendMessageToSocket(response.text)
    }
    setMessageText('')
    setIsFileSelector(false)
    console.log("send message called")
  }
  const getDate = (dateInfo) => {
    const date = new Date(dateInfo)
    return (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate())+"/"+(date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth())+"/"+date.getFullYear()
  }

  const onChangeSearchHandler = (event) => {
    dispatch(searchUser(event.target.value.trim()))
  }

  return (
    <div className='chat-area'>
      <div className={`user ${isLeft ? '' : 'd-none'}`}>
        <div className='search'>
            <input type='text' onChange={e => onChangeSearchHandler(e)} placeholder='Search by name...' className='search-box'/>
        </div>
        <div className='user-list'>
          {
            users.map((item) => {
              return (
                profile._id !== item._id && <Usercard key={item._id} data={item} isActive={activeUser[item._id] ? true : false} isSelected={item._id === selectedUser._id}/>
              )
            })
          }
        </div>
      </div>
      {!selectedUser.email ? <Welcome /> : <div className="chat">
        {selectedUser.email && <div className='title'>
          <img src='https://www.nicepng.com/png/detail/856-8561250_profile-pic-circle-girl.png' />
          <p className='name'>
            <div>{selectedUser.name}</div>
            <div style={{color: "rgb(0 255 20)"}}> {activeUser[selectedUser._id] ? "Online" : ""}</div>
          </p>
        </div>}
        <div className='chat-section' ref={chatSectionRef}>
          { 
            messageList.map((item) => {
              return (
                item.senderId === profile._id ? item.fileType === "text" ? <Sendtext key={item._id} data={item}/> : <Sendfile data={item} /> : item.fileType === "text" ? <Recievetext key={item._id} data={item} /> : <Recieverfile data={item} />
              )
            })
          }
          <div className={`${isFileSelector ? '' : 'd-none'}`}>
            <Fileselctor setIsFileSelector={setIsFileSelector} isFile={isFile} setIsFile={setIsFile} onSumbitMessageHandeler={onSumbitMessageHandeler}/>
          </div>
        </div>
        {selectedUser.email && <div className="send-message">
          <form onSubmit={e => onSumbitMessageHandeler(e)}>
            <i class="fa-solid fa-plus" onClick={() => setIsFileSelector(true)}></i>
            <input type='text' name='message' placeholder='Message...' className='message-box' value={messageText} onChange={e => setMessageText(e.target.value)}/>
            <button className='button' name='text' type='submit'>send</button>
          </form>
        </div>}
      </div>}

      <div className={`profile-div ${isProfileOpen ? '' : 'd-none'}`}>
          <i class="fa-solid fa-xmark" onClick={() => setIsProfileOpen(false)}></i>
          <img src='https://www.nicepng.com/png/detail/856-8561250_profile-pic-circle-girl.png' />
          <h3 className='text-center mt-2'>{profile.name}</h3>
          {/* <input type='text' value={profile.name} placeholder='Name'/> */}
          <div className='personal-info'>
            <p><strong>Email : </strong> {profile.email}</p>
            <p><strong>Join : </strong> {getDate(profile.createDate)}</p>
            <p></p>
          </div>
      </div>

    </div>
  )
}

export default Chatarea
