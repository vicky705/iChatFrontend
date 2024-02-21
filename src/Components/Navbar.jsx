import React, { useEffect, useState } from 'react'
import googlelogo from '../assets/googlelogo.png'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { getProfile, loginUser } from '../Redux/ApiHandler'
import { toast } from 'react-toastify'
import { useDispatch ,useSelector } from 'react-redux'
import { setProfile, setAuthToken } from '../Redux/messageSlice'

const Navbar = () => {
    const [openLogin, setOpenLogin] = useState(false)
    const [isLogin, setIsLogin] = useState(false)
    const [user, setUser] = useState({});
    const dispatch = useDispatch()
    const profile = useSelector(state => state.profile.data)

    const loginHandler = async(event) => {
        event.preventDefault()
        const data = await loginUser(user)
        if(!data.status) return toast.warn(data.message)
        toast.success(data.message)
        dispatch(setProfile(data.user))
        setIsLogin(true)
        setOpenLogin(false)
    }
    const responseMessage = async(response) => {
        const data = jwtDecode(response.credential)
        console.log(data)
    };
    const errorMessage = (error) => {
        console.log(error);
    }

    const call = async(authToken) => {
        const data = await getProfile(authToken)
        if(data.status){
            // toast.success('Autologin successfully.')
            dispatch(setProfile(data.user))
            setIsLogin(true)
            setOpenLogin(false)
        }
    }

    useEffect(() => {
        const authToken = localStorage.getItem('authToken')
        if(authToken){
        call(authToken)
        dispatch(setAuthToken(authToken))
        }
    }, [])

  return (
    <div className='navbar p-0'>
        <div className="nav-div">
            <div className="logo">
                <p className='text-light'><span></span>Chat</p>
            </div>
            <div className="login">
                <button className={isLogin ? 'd-none' : ''} onClick={() => setOpenLogin(true)}>Login</button>
                <img className={isLogin ? '' : 'd-none'} src='https://www.nicepng.com/png/detail/856-8561250_profile-pic-circle-girl.png' />
            </div>
        </div> 

        <div className={`loginPage ${openLogin ? '' : 'd-none'}`}>
            <i className="fa-solid fa-circle-xmark" onClick={() => setOpenLogin(false)}></i>
            <form onSubmit={(e) => loginHandler(e)}>
                <p className='title'>Login</p>
                <input type='email' placeholder='Email id' name='email' onChange={e => setUser({...user, [e.target.name] : e.target.value})}/>
                <input type='password' placeholder='Password' name='password' onChange={e => setUser({...user, [e.target.name] : e.target.value})}/>
                <button>Login</button>
                <hr></hr>
                <p className='or'>OR</p>
                <div className="google">
                <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
                </div>
            </form>
        </div>
    </div>
  )
}

export default Navbar
