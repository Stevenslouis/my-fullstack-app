import { useState, useEffect } from 'react';
import { changePassword, registerUser, resetTokenValidator } from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import validator from 'validator'


function ResetPassword() {
    const navigate = useNavigate()
    const [success, setSuccess] = useState(false)
    const [password, setPassword] = useState([""])
    const [message, setMessage] = useState("")
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        setToken(tokenFromUrl);

        const checkToken = async () => {
            try {
                const response = await resetTokenValidator(tokenFromUrl)
                if (response.success) {
                    return 
                } 
                navigate('/home')
            } catch (err) {
                navigate('/home')
            }
        }

        checkToken()
    }, [searchParams]);

    const reset = async () => {
        if (password === "") {
            setMessage("Enter New Password")
        }
        try {
            const response = await changePassword(token, password)            
            setMessage(response.message)
            setSuccess(true)

        } catch (err) {
            setMessage("Unable to reset password. Try again later.")
        }
    }

    return (
        <div className='background'>
            <div className="login-form">

                {success ? (
                    <div className='login-content'>
                        <div>{message}</div>
                        <button className="btn" onClick={() => navigate('/login')} >Login</button>
                    </div>

                ) : (<div className='login-content'>

                    <div>Enter New Password</div>
                    <label>
                        <div className='login-input-label'>Password</div>
                        <input type="text" className='login-input' required onChange={(e) => setPassword(e.target.value)}></input>
                    </label>

                    <div className='login-btns'>
                        <button className="btn" onClick={() => navigate('/login')} >Cancel</button>
                        <button className="btn" onClick={reset}>Update Password</button>
                    </div>
                    <div className='login-error-msg'>{message}</div>
                </div>)}

            </div>
        </div>

    )
}

export default ResetPassword