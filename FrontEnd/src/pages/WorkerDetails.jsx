import Layout from "../components/Layout"
import { useParams } from "react-router-dom"

export default function WorkerDetails(){

const { id } = useParams()

const worker = {

id:id,
name:"Ali Ahmad",
age:30,
job:"Construction Worker",
department:"Building Site A",

temperature:50,
gas:350,
flame:true

}

let status = "Safe"

if(worker.temperature > 45 || worker.gas > 300 || worker.flame){
status = "Danger"
}

return(

<Layout>

<h1>Worker Details</h1>

<style>
{`
@keyframes blink {
0% { opacity: 1; }
50% { opacity: 0.3; }
100% { opacity: 1; }
}

.danger {
background:#ff0000;
color:white;
padding:8px 16px;
border-radius:8px;
animation: blink 1s infinite;
}

.safe {
background:#4CAF50;
color:white;
padding:8px 16px;
border-radius:8px;
}
`}
</style>

<div style={{
background:"white",
padding:"30px",
marginTop:"20px",
borderRadius:"10px",
boxShadow:"0 10px 20px rgba(0,0,0,0.1)"
}}>

<h2>{worker.name}</h2>

<p><b>Age:</b> {worker.age}</p>
<p><b>Job:</b> {worker.job}</p>
<p><b>Department:</b> {worker.department}</p>

<p>

<b>Status:</b>

<span className={status === "Danger" ? "danger" : "safe"} style={{marginLeft:"10px"}}>

{status}

</span>

</p>

</div>

<div style={{
marginTop:"20px",
background:"white",
padding:"25px",
borderRadius:"10px",
boxShadow:"0 10px 20px rgba(0,0,0,0.1)"
}}>

<h2>Sensor Data</h2>

<p>🌡 Temperature: {worker.temperature} °C</p>

<p>☁ Gas Level: {worker.gas}</p>

<p>🔥 Flame Detected: {worker.flame ? "YES" : "NO"}</p>

</div>

</Layout>

)

}