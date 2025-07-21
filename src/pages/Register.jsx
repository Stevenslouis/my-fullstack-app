import { useState, useEffect } from 'react';
import { registerUser } from '../services/api';
import { loginUser, isLoggedIn } from '../services/api';
import { useNavigate } from 'react-router-dom';
import validator from 'validator'
import ConfirmRegistration from '../components/ConfirmRegistration';


function Register() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [emailCheck, setEmailCheck] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [registerModalOpen, setRegisterModalOpen] = useState(false);


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
        if (email.length === 0){
            setErrorMessage("Provide Email")
            setRegisterModalOpen(false)  
            return          
        }
        if (email !== emailCheck) {
            setErrorMessage("Emails Must Match")
            setRegisterModalOpen(false)
            return
        }

        if (!validator.isEmail(email)) {
            setErrorMessage("Invalid Email");
            setRegisterModalOpen(false)
            return
        }

        try {
            const response = await registerUser({
                email: email,
                emailCheck: emailCheck,
                password: password
            })

            if (!response?.success) {
                setErrorMessage(response.message)
                setRegisterModalOpen(false)
            } 
            else if (response.success) {
                navigate("/login")
            }
        } catch (err) {

            setRegisterModalOpen(false)
            setErrorMessage("Registration failed. Could not connect to server ")

        } finally {

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
                        <div className='login-input-label'>Enter Email Again</div>
                        <input type="text" className='login-input' required onChange={(e) => setEmailCheck(e.target.value)}></input>
                    </label>

                    <label>
                        <div className='login-input-label' >Password</div>

                        <input type="text" className='login-input' required onChange={(e) => setPassword(e.target.value)}></input>
                    </label>
                    <div className='login-btns'>

                        <button className="btn" onClick={() => navigate('/login')}>I Have An Account</button>
                        <button className="btn" onClick={()=>setRegisterModalOpen(true)}>Register</button>

                    </div>

                    <div className='login-error-msg'>{errorMessage}</div>


                </div>
            </div>



            <ConfirmRegistration
                isOpen={registerModalOpen}
                onClose={() => setRegisterModalOpen(false)}
                registerFunction = {submitForm}
            />
        </div>

    )
}

export default Register