import { Button } from '@material-ui/core'
import { auth, provider } from './firebase'
import React from 'react'
import './Login.css'

function Login() {

    const signIn = () => {
        auth.signInWithPopup(provider).catch((error) => alert(error.message));
    }

    return (
        <div className = "login" >
            <div className = "login__logo">
                <img
                    src = "https://i.pinimg.com/originals/e5/89/38/e589388eb222889b1771b439a51510bb.png"
                    alt = ""
                />
            </div>

            <Button onClick = {signIn} >
                Sing In
            </Button>
        </div>
    )
}

export default Login