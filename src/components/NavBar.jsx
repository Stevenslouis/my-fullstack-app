import '../css/NavBar.css'

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, logOutUser } from '../services/api';
function NavBar() {

    const navigate = useNavigate()
    const [user, setUser] = useState(false)
    const [userEmail, setUserEmail] = useState("")

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const response = await isLoggedIn()
                if (response.success) {
                    setUser(true)
                    setUserEmail(response.data)
                } else {
                    setUser(false)
                }
            } catch (err) {
                setUser(false)
            }
        }
        checkLoggedIn()
    }, [user])

    const logout = async()=>{
        try{
            const response = await logOutUser()
            response.success && navigate('/login')
        }catch(err){
            navigate('/login')
        }
    }

    return <nav className="navbar">
        <div className="navbar-brand">
            <button className="home-btn" onClick={()=>navigate("/home")}></button>
        </div>
        <div className="navbar-links">
            {user && <button className="logout-btn" onClick = {logout} title={`Log out of ${userEmail}`}></button>}

        </div>


    </nav>

}

export default NavBar