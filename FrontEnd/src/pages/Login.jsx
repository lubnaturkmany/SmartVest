import { useNavigate } from "react-router-dom"
import "./Login.css"

export default function Login(){

const navigate = useNavigate()

const handleLogin = (e)=>{
e.preventDefault()
navigate("/dashboard")
}

return(

<div className="login-page">

<div className="login-card">

<div className="logo">🦺</div>

<h1 className="title">SmartVest</h1>

<p className="subtitle">
Worker Safety Monitoring System
</p>

<form onSubmit={handleLogin}>

<input
type="email"
placeholder="Email"
className="input"
/>

<input
type="password"
placeholder="Password"
className="input"
/>

<button className="btn">
Login
</button>

</form>

</div>

</div>

)

}