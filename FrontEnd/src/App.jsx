import { Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Workers from "./pages/Workers"
import Alerts from "./pages/Alerts"
import WorkerDetails from "./pages/WorkerDetails"
import WorkersMap from "./pages/WorkersMap"

function App(){

return(

<Routes>

<Route path="/" element={<Login/>} />

<Route path="/dashboard" element={<Dashboard/>} />

<Route path="/workers" element={<Workers/>} />

<Route path="/alerts" element={<Alerts/>} />

<Route path="/worker/:id" element={<WorkerDetails/>} />

<Route path="/map" element={<WorkersMap/>} />

</Routes>

)

}

export default App