import React, { useState } from 'react'
import { useNavigate ,Link} from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../../../components/LoadingSpinner'

const Login = () => {
const {loading,handleLogin} = useAuth()
const navigate=useNavigate()

const [email,setEmail] = useState("")
const [password,setPassword]= useState("")
const [error,setError]= useState("")

    const handleSubmit = async (e) =>{
        e.preventDefault()
        setError("")
        try {
            const success = await handleLogin({email,password})
            if (success) {
                navigate("/")
            }
        } catch (err) {
            setError(err.message || "Login failed. Please try again.")
        }
    } 
    
    if(loading){
        return <LoadingSpinner text="Signing In..." fullScreen={true} />
    }
    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                {error && <div className="error-message">{error}</div>}
                <form  onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor='email'>Email</label>
                        <input onChange={(e) => {setEmail(e.target.value)}}
                         type="email" name="email" id="email" placeholder='Enter email address '></input>
                    </div>
                    <div className="input-group">
                        <label htmlFor='password'>Password</label>
                        <input onChange={(e) => {setPassword(e.target.value)}}
                        type="password" name="password" id="password" placeholder='Enter password '></input>
                    </div>

                    <button className='button primary-button'>Login</button>
                </form>
                <p>Don't have an account?<Link to={"/register"}>Register</Link></p>
            </div>
        </main>
    )
}

export default Login
