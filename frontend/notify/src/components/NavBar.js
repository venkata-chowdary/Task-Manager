import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faL, faTimes, faSort, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { UserContext } from "../Context/UserContext"
import { useContext } from 'react';
import axios from 'axios';
const { Link } = require("react-router-dom")

function NavBar(props) {
    const { userDetails } = useContext(UserContext)
    const [tasksData, setTasksData] = useState([]);
    const [toggle, setToggle] = useState(false);
    const currentDate = new Date();

    useEffect(() => {
        axios.get('http://localhost:4000/gettasksdata', { withCredentials: true })
            .then((response) => {
                const filtered = response.data.filter(task => new Date(task.taskDate) < currentDate);
                setTasksData(filtered);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    console.log(userDetails)


    function sideBarToggle() {
        props.setToggleSideBar((toggleSideBar) => !toggleSideBar)
    }

    const toggleSideBar = props.toggleSideBar

    return (
        <div className="navbar">
            <div className='first'>
                <button onClick={sideBarToggle} className={`toggle-btn ${toggleSideBar ? 'open' : 'closed'}`}>
                    {toggleSideBar ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
                </button>
                <h2>
                    Hello, {userDetails.username}
                </h2>
            </div>
            <div className='second'>
                <Link to='/profile'>Profile</Link>
                <div className='pending-tasks'>
                    <button className="toggle-button" onClick={() => setToggle(!toggle)}>
                        {/* <FontAwesomeIcon icon={faExclamationCircle} style={{ fontSize: 14 }} /> */}
                        <h2>Pending Tasks</h2>
                        <span className='pending-tasks-count'>{tasksData.length}</span>

                    </button>
                    <div className={`task-list ${toggle ? 'active' : ''}`}>
                        {tasksData.length > 0 ? (
                            <ul>
                                {tasksData.map((task, index) => (
                                    <li key={index}>
                                        {task.taskTitle}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No pending tasks</p>
                        )}
                    </div>
                </div>
                {useContext && <button className="logout-btn" onClick={() => props.logout()}>Logout</button>}

            </div>

        </div>

    )
}

export default NavBar