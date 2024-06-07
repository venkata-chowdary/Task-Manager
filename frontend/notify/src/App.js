import './App.css'
import './style/Container.css'
import './style/SideBar.css'
import './style/Profile.css'
import './style/NavBar.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom'
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from './components/Home'
import Profile from './components/Profile';
import { UserProvider } from './Context/UserContext'

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path='/profile' element={<Profile />}></Route>
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App