import React,{useState} from 'react'
import { useNavigate ,Link} from 'react-router'
import {useAuth} from "../hooks/useAuth"
import "../auth.form.scss"
import LoadingSpinner from '../../../components/LoadingSpinner'

const Register = () => {
    const navigate=useNavigate()
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [error,setError]=useState("")

    const {loading,handleRegister} = useAuth()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        setError("")
        try {
            const success = await handleRegister ({username,email,password})
            if (success) {
                navigate("/")
            }
        } catch (err) {
            setError(err.message || "Registration failed. Please check your details and try again.")
        }
    } 
    if(loading){
        return <LoadingSpinner text="Creating Account..." fullScreen={true} />
    }
    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>
                {error && <div className="error-message">{error}</div>}
                <form  onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor='username'>Username</label>
                        <input
                         onChange={(e)=>{setUsername(e.target.value)}}
                        type="text" name="username" id="username" placeholder='Enter username '></input>
                    </div>
                    <div className="input-group">
                        <label htmlFor='email'>Email</label>
                        <input
                         onChange={(e)=>{setEmail(e.target.value)}}
                        type="email" name="email" id="email" placeholder='Enter email address '></input>
                    </div>
                    <div className="input-group">
                        <label htmlFor='password'>Password</label>
                        <input 
                         onChange={(e)=>{setPassword(e.target.value)}}
                        type="password" name="password" id="password" placeholder='Enter password '></input>
                    </div>

                    <button className='button primary-button'>Register</button>
                </form>
                <p>Already have an account?<Link to={"/login"}>Login</Link></p>
            </div>
        </main>
    )
}

export default Register
