import { useState, useEffect } from 'react';
import { loginUser, isLoggedIn } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css'
import { validator } from 'validator';

function Login() {

    const [email, setEmail] = useState([""])
    const [password, setPassword] = useState([""])
    const [errorMessage, setErrorMessage] = useState([""])
    const navigate = useNavigate();


    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const response = await isLoggedIn()
                if (response.success) {
                    navigate('/home')
                }
            } catch (err) {

            }
        }
        checkLoggedIn()
    }, [])



    const submitForm = async (e) => {
        e.preventDefault()

        if (email === "" || password === "") {
            setErrorMessage("Email and password required")
            return
        }
        try {
            const response = await loginUser({
                email: email,
                password: password
            })

            if (!response?.success) {
                setErrorMessage(response.message)
                return
            } else {
                navigate('/home')
            }
        } catch (err) {
            setErrorMessage("Login failed. Could not connect to server ")
            return
        }
    }


    return (
        <div className='background'>
            <div className="login-form">
                <div className='login-content'>
                    <label>
                        <div className='login-input-label'>Email</div>
                        <input type="text" className='login-input' required onChange={(e) => setEmail(e.target.value)}></input>
                    </label>

                    <label>
                        <div className='login-input-label' >Password</div>

                        <input type="password" className='login-input' required onChange={(e) => setPassword(e.target.value)}></input>
                    </label>
                    <button className="link-btn" onClick={() => navigate('/forgot-password')}>forgot password?</button>

                    <div className='login-btns'>

                        <button className="btn" onClick={() => navigate('/register')} >Create Account</button>
                        <button className="btn" onClick={(e) => submitForm(e)}>Log In</button>

                    </div>

                    <div className='login-error-msg'>{errorMessage}</div>


                </div>
            </div>
        </div>




    )
}

export default Login