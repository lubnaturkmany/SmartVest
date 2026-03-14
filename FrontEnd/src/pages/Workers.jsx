import Layout from "../components/Layout"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function Workers(){

const [workers , setWorkers] = useState([])

useEffect(()=>{

const data = [

{
id:1,
name:"Ali Ahmad",
temperature:50,
gas:350,
flame:true
},

{
id:2,
name:"Sara Khaled",
temperature:35,
gas:120,
flame:false
},

{
id:3,
name:"Omar Hassan",
temperature:38,
gas:100,
flame:false
}

]

setWorkers(data)

},[])

return(

<Layout>

<style>
{`

@keyframes blink {

0% { opacity:1; }

50% { opacity:0.3; }

100% { opacity:1; }

}

.danger{

background:#ff0000;
color:white;
padding:6px 12px;
border-radius:6px;
animation: blink 1s infinite;

}

.safe{

background:#4CAF50;
color:white;
padding:6px 12px;
border-radius:6px;

}

`}
</style>

<h1>Workers</h1>

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

<th style={{padding:"12px"}}>ID</th>
<th>Name</th>
<th>Status</th>

</tr>

</thead>

<tbody>

{workers.map(worker => {

let status = "Safe"

if(worker.temperature > 45 || worker.gas > 300 || worker.flame){

status = "Danger"

}

return(

<tr key={worker.id} style={{textAlign:"center"}}>

<td style={{padding:"10px"}}>{worker.id}</td>

<td>

<Link to={`/worker/${worker.id}`}>

{worker.name}

</Link>

</td>

<td>

<span className={status === "Danger" ? "danger" : "safe"}>

{status}

</span>

</td>

</tr>

)

})}

</tbody>

</table>

</Layout>

)

}