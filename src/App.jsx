import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { setAuthToken, setProfile } from './Redux/messageSlice'
import { getProfile } from './Redux/ApiHandler'
import Chatarea from './Components/Chatarea/Chatarea'
import Usercard from './Components/Chatarea/Usercard'



function App() {
  const profile = useSelector(state => state.profile.data)
  return (
    <>
      <div className="container-fluid">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          /><ToastContainer />
        <Navbar />
        {profile.name && <Chatarea />}
      </div>
    </>
  )
}

export default App
