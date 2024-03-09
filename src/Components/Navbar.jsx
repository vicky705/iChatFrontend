import React, { useEffect, useState } from 'react'
import googlelogo from '../assets/googlelogo.png'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { getProfile, loginUser, registerUser } from '../Redux/ApiHandler'
import { toast } from 'react-toastify'
import { useDispatch ,useSelector } from 'react-redux'
import { setProfile, setAuthToken } from '../Redux/messageSlice'

const Navbar = ({isProfileOpen, setIsProfileOpen, isLeft, setIsLeft}) => {
    const [openLogin, setOpenLogin] = useState(false)
    const [isLogin, setIsLogin] = useState(false)
    const [openRegister, setOpenRegister] = useState(false)
    const [user, setUser] = useState({});
    const dispatch = useDispatch()
    const profile = useSelector(state => state.profile.data)
    const [registerInfo, setRegisterInfo] = useState({
        "name" : "",
        "email" : "",
        "password" : ""
    })
    const [rePassword, setRePassword] = useState('')
    const [regBtn, setRegBtn] = useState(true)
    const [otp, setOtp] = useState({
        sendOtp : '',
        enteredOtp : ''
    })
    const [isSendOtp, setIsOtpSend] = useState(false)

    const loginHandler = async(event) => {
        event.preventDefault()
        const data = await loginUser(user)
        if(!data.status) return toast.warn(data.message)
        dispatch(setProfile(data.user))
        dispatch(setAuthToken(data.authToken))
        setIsLogin(true)
        closeAllHandler()
        toast.success(data.message)
    }
    const responseMessage = async(response) => {
        const data = jwtDecode(response.credential)
        setRegisterInfo({...registerInfo, 
            name : data.name,
            email : data.email,
            password : Math.random()*100,
            profile : data.picture
        })
        registrationOAuthHandler()
    };
    const errorMessage = (error) => {
        console.log(error);
    }

    const call = async(authToken) => {
        const data = await getProfile(authToken)
        if(data.status){
            // toast.success('Autologin successfully.')
            dispatch(setProfile(data.user))
            dispatch(setAuthToken(authToken))
            setIsLogin(true)
            closeAllHandler()
        }
        else{
            toast.warn("Login Failed.")
        }
    }

    const registrationHandler = async(e) => {
        e.preventDefault()
        if(registerInfo.password !== rePassword) return toast.warn("Password miss match!")
        const response = await registerUser(registerInfo)
        if(!response.status) return toast.warn(response.message)
        toast.success(response.message)
        dispatch(setProfile(response.user))
        dispatch(setAuthToken(response.authToken))
        setIsLogin(true)
        closeAllHandler()
        setRegisterInfo({})
        setRePassword('')
    }
    const registrationOAuthHandler = async() => {
        console.log(registerInfo)
        // const response = await registerUser(registerInfo)
        // if(!response.status) return toast.warn(response.message)
        // toast.success(response.message)
        // dispatch(setProfile(response.user))
        // dispatch(setAuthToken(response.authToken))
        // setIsLogin(true)
        // closeAllHandler()
        // setRegisterInfo({})
        // setRePassword('')
    }

    const openLoginHandler = () => {
        setOpenRegister(false)
        setOpenLogin(true)
    }
    const openRegisterHandler = () => {
        setOpenRegister(true)
        setOpenLogin(false)
    }
    const closeAllHandler = () => {
        setOpenRegister(false)
        setOpenLogin(false)
    }

    useEffect(() => {
        const authToken = localStorage.getItem('authToken')
        if(authToken){
            call(authToken)
            dispatch(setAuthToken(authToken))
        }
    }, [])

    const [isMenu, setIsMenu] = useState(false)

    const logoutHandler = () => {
        localStorage.removeItem('authToken')
        dispatch(setAuthToken(''))
        dispatch(setProfile({}))
        setIsLogin(false)
        setIsMenu(false)
        toast.success("Logout successfully.")
    }

    const onClickOpenProfileHandler = () => {
        setIsMenu(false)
        setIsProfileOpen(!isProfileOpen)
    }

    const sendOtpHandler = () => {
        
    }
  return (
    <div className='navbar p-0'>
        <div className="nav-div">
            <div className="logo">
                <i class="fa-solid fa-bars" onClick={() => setIsLeft(!isLeft)}></i>
                <p className='text-light'><span></span>Chat</p>
            </div>
            <div className="login">
                <button className={isLogin ? 'd-none' : ''} onClick={() => openLoginHandler()}>Login</button>
                <img className={isLogin ? '' : 'd-none'} src='https://www.nicepng.com/png/detail/856-8561250_profile-pic-circle-girl.png' onClick={() => setIsMenu(!isMenu)} />
                <div className={`menu ${isMenu ? '' : 'd-none'} `}>
                    <ul>
                        <li onClick={() => onClickOpenProfileHandler()}>Profile</li>
                        <li onClick={() => logoutHandler()}>Logout</li>
                    </ul>
                </div>
            </div>
        </div> 

        <div className={`loginPage ${openLogin ? '' : 'd-none'}`}>
            <i className="fa-solid fa-circle-xmark" onClick={() => closeAllHandler()}></i>
            <form onSubmit={(e) => loginHandler(e)}>
                <p className='title'>Login</p>
                <input type='email' placeholder='Email id' name='email' onChange={e => setUser({...user, [e.target.name] : e.target.value})}/>
                <input type='password' placeholder='Password' name='password' onChange={e => setUser({...user, [e.target.name] : e.target.value})}/>
                <button className='button' type='submit' >Login</button>
                <hr></hr>
                <p className='switch'>I don't have an account <span onClick={e => openRegisterHandler()}>Register</span></p>
                <p className='or'>OR</p>
                <div className="google">
                <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
                </div>
            </form>
        </div>

        <div className={`loginPage ${openRegister ? '' : 'd-none'}`}>
            <i className="fa-solid fa-circle-xmark" onClick={() => closeAllHandler()}></i>
            <form onSubmit={(e) => registrationHandler(e)}>
                <p className='title'>Register</p>
                <input type='text' placeholder='Name' name='name' value={registerInfo.name} onChange={e => setRegisterInfo({...registerInfo, [e.target.name] : e.target.value})} required/>
                <div className='email'>
                <input type='email' placeholder='Email id' name='email' value={registerInfo.email} onChange={e => setRegisterInfo({...registerInfo, [e.target.name] : e.target.value.trim()})} required/>
                {/* <button className='button' type='send' onClick={() => sendOtpHandler()}>Send OTP</button> */}
                </div>
                {/* <input type='text' placeholder='OTP' className={setIsOtpSend ? 'd-none' : ''} value={otp.sendOtp} required/> */}
                <input type='password' placeholder='Password' name='password' value={registerInfo.password} onChange={e => setRegisterInfo({...registerInfo, [e.target.name] : e.target.value.trim()})} required/>
                <input type='password' placeholder='Re-Password' name='rePassword' value={rePassword} onChange={e => setRePassword(e.target.value.trim())} required/>
                <button className='button'>Register</button>
                <hr></hr>
                <p className='switch'>I have an account <span onClick={e => openLoginHandler()}>Register</span></p>
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
