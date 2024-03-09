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
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isLeft, setIsLeft] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setIsLeft(window.innerWidth > 668)
    }

    handleResize() // Call it initially
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
          theme='light'
        />
        <Navbar isProfileOpen={isProfileOpen} setIsProfileOpen={setIsProfileOpen} isLeft={isLeft} setIsLeft={setIsLeft}/>
        {profile.name && <Chatarea isProfileOpen={isProfileOpen} setIsProfileOpen={setIsProfileOpen} isLeft={isLeft}/>}
      </div>
    </>
  )
}

export default App
