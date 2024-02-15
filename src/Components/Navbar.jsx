import React, { useState } from 'react'
import googlelogo from '../assets/googlelogo.png'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

const Navbar = () => {
    const [openLogin, setOpenLogin] = useState(false)
    const [isLogin, setIsLogin] = useState(false)
    const loginHandler = (event) => {
        event.preventDefault()
        setIsLogin(true)
        setOpenLogin(false)
    }
    const responseMessage = async(response) => {
        const data = jwtDecode(response.credential)
        console.log(data)
    };
    const errorMessage = (error) => {
        console.log(error);
    };
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
                <input type='email' placeholder='Email id'/>
                <input type='password' placeholder='Password' />
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
