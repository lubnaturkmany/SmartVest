import Layout from "../components/Layout"

export default function Dashboard(){

const dangerWorkers = 1

return(

<Layout>

<style>
{`
@keyframes blink {

0% { opacity:1; }

50% { opacity:0.3; }

100% { opacity:1; }

}

.dangerAlert{

background:#ff0000;
color:white;
padding:20px;
border-radius:10px;
margin-top:20px;
font-weight:bold;
font-size:18px;

animation: blink 1s infinite;

}
`}
</style>

<h1>Dashboard</h1>

<img
src="https://cdn-icons-png.flaticon.com/512/3659/3659898.png"
style={{width:"120px", marginTop:"20px"}}
/>

{dangerWorkers > 0 && (

<div className="dangerAlert">

🚨 WARNING: Worker in Danger!

</div>

)}

<div style={{
display:"flex",
gap:"20px",
marginTop:"30px"
}}>

<div style={{
background:"#ffb347",
padding:"20px",
borderRadius:"10px",
width:"200px",
color:"white"
}}>

Total Workers
<h2>24</h2>

</div>

<div style={{
background:"#ff7a00",
padding:"20px",
borderRadius:"10px",
width:"200px",
color:"white"
}}>

Active Alerts
<h2>3</h2>

</div>

<div style={{
background:"#ffa500",
padding:"20px",
borderRadius:"10px",
width:"200px",
color:"white"
}}>

Workers Safe
<h2>21</h2>

</div>

</div>

</Layout>

)

}