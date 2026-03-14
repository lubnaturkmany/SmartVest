import { Link } from "react-router-dom"

export default function Layout({ children }) {

return (

<div style={{display:"flex"}}>

<div style={{
width:"220px",
background:"#ff7a00",
color:"white",
minHeight:"100vh",
padding:"20px"
}}>

<h2>🦺 SmartVest</h2>

<ul style={{listStyle:"none", padding:0}}>

<li style={{margin:"20px 0"}}>
<Link to="/dashboard" style={{color:"white", textDecoration:"none"}}>
Dashboard
</Link>
</li>

<li style={{margin:"20px 0"}}>
<Link to="/workers" style={{color:"white", textDecoration:"none"}}>
Workers
</Link>
</li>

<li style={{margin:"20px 0"}}>
<Link to="/alerts" style={{color:"white", textDecoration:"none"}}>
Alerts
</Link>
</li>

<li style={{margin:"20px 0"}}>
<Link to="/map" style={{color:"white", textDecoration:"none"}}>
Workers Map
</Link>
</li>

</ul>

<button style={{
marginTop:"40px",
padding:"10px",
borderRadius:"6px",
border:"none"
}}>
Logout
</button>

</div>

<div style={{
flex:1,
padding:"40px",
background:"#f5f5f5"
}}>

{children}

</div>

</div>

)

}