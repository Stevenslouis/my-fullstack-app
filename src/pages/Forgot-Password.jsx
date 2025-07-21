import { useState, useEffect } from 'react';

import { sendPasswordResetLink } from '../services/api';
import { useNavigate } from 'react-router-dom';


function ForgotPassword() {
    const navigate = useNavigate()
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState([""])
    const [message, setMessage] = useState("")

    const sendLink = async () => {

        try {
            const response = await sendPasswordResetLink(email)
            setMessage(response.message)

            if (response.success) {
                setSuccess(true)
            } else
                setMessage(response.message)

        } catch (err) {
            setMessage("Email failed. Could not connect to server.")
        }
    }

    return (
        <div className='background'>
            <div className="login-form">

                {success ? (
                    <div className='login-content'>
                        <div>{message}</div>
                        <button className="link-btn btn" onClick={() => navigate('/login')} >Back To Home</button>
                    </div>

                ) : (<div className='login-content'>

                    <div>Enter Email To Send Password Reset Link</div>
                    <label>
                        <div className='login-input-label'>Email</div>
                        <input type="text" className='login-input' required onChange={(e) => setEmail(e.target.value)}></input>
                    </label>

                    <div className='login-btns'>
                        <button className="btn" onClick={() => navigate('/login')} >Cancel</button>
                        <button className="btn" onClick={sendLink}>Send Link</button>
                    </div>
                    <div className='login-error-msg'>{message}</div>
                </div>)}
            </div>
        </div>

    )
}

export default ForgotPassword