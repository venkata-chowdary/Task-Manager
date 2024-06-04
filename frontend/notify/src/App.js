import Container from "./components/Container"
import './App.css'
import './style/Container.css'
import './style/SideBar.css'
import SideBar from "./components/SideBar"
import { useState } from "react"

function App(){
  const [reRenderSidebar,setreRenderSidebar]=useState(false)


  return (
    <div className="app">
      <SideBar reRenderSidebar={reRenderSidebar} setreRenderSidebar={setreRenderSidebar}/>
      <Container setreRenderSidebar={setreRenderSidebar}/>
    </div>
    
  )
}

export default App