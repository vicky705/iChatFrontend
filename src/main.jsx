import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './Redux/Store.js'; 
import { Provider } from 'react-redux';


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="1071827552286-ral9j19f87ie81kpu8g0i6fcmrhrgth5.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </Provider>
  // </React.StrictMode>
)