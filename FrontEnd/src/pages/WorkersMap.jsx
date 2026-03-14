import Layout from "../components/Layout"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

export default function WorkersMap(){

const workers = [

{ id:1 , name:"Ali" , lat:31.9539 , lng:35.9106 },
{ id:2 , name:"Sara" , lat:31.955 , lng:35.912 },
{ id:3 , name:"Omar" , lat:31.951 , lng:35.909 }

]

return(

<Layout>

<h1>Workers Location Map</h1>

<MapContainer
center={[31.9539,35.9106]}
zoom={13}
style={{height:"500px", marginTop:"20px"}}
>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

{workers.map(worker => (

<Marker
key={worker.id}
position={[worker.lat , worker.lng]}
>

<Popup>
Worker: {worker.name}
</Popup>

</Marker>

))}

</MapContainer>

</Layout>

)

}