import Layout from "../components/Layout"
import { useState, useEffect } from "react"

export default function Alerts(){

const [alerts , setAlerts] = useState([])

useEffect(()=>{

// بيانات مؤقتة
const data = [

{
id:1,
worker:"Ali Ahmad",
type:"Fall Detected",
time:"10:30",
level:"Danger"
},

{
id:2,
worker:"Sara Khaled",
type:"High Temperature",
time:"11:15",
level:"Warning"
},

{
id:3,
worker:"Omar Hassan",
type:"No Movement",
time:"12:00",
level:"Danger"
}

]

setAlerts(data)

},[])

return(

<Layout>

<h1>Alerts</h1>

<table style={{
width:"100%",
marginTop:"30px",
background:"white",
borderRadius:"10px",
overflow:"hidden",
boxShadow:"0 10px 20px rgba(0,0,0,0.1)"
}}>

<thead style={{background:"#ff7a00",color:"white"}}>

<tr>

<th style={{padding:"12px"}}>Worker</th>
<th>Type</th>
<th>Time</th>
<th>Level</th>

</tr>

</thead>

<tbody>

{alerts.map(alert => (

<tr key={alert.id} style={{textAlign:"center"}}>

<td style={{padding:"10px"}}>{alert.worker}</td>

<td>{alert.type}</td>

<td>{alert.time}</td>

<td>

<span style={{
padding:"6px 12px",
borderRadius:"6px",
background:
alert.level==="Danger"
? "#f44336"
: "#ff9800",
color:"white"
}}>

{alert.level}

</span>

</td>

</tr>

))}

</tbody>

</table>

</Layout>

)

}