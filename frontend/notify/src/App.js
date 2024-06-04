import './App.css'
import './style/Container.css'
import './style/SideBar.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom'
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from './components/Home'


function App() {
  return (
    <Router>
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App