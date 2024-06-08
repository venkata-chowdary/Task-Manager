import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../Context/UserContext"
import Task from "./Task"
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLessThan, faBars, faCaretLeft } from '@fortawesome/free-solid-svg-icons';

function Profile() {
    const { userDetails, setUserDetails } = useContext(UserContext)
    const [tasksData, settasksData] = useState([])
    const [isEdit, setEdit] = useState(false)
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");


    useEffect(() => {
        axios.get('http://localhost:4000/gettasksdata', { withCredentials: true })
            .then((response) => {
                console.log(response)
                if (response.status === 200) {
                    settasksData(response.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])


    function handleEdit() {
        setEdit(true)
        setNewUsername(userDetails.username);
        setNewEmail(userDetails.email);
    }

    function handleSave(e) {
        e.preventDefault()
        axios.post('http://localhost:4000/updateuser', { newUsername, newEmail }, { withCredentials: true })
            .then((response) => {
                console.log(response.data)
                setUserDetails(response.data);
                setEdit(false);
            })
            .catch((err) => {
                console.log(err)
            })

    }

    if (!userDetails) {
        return <div>Loading...</div>;
    }



    return (
        <div className="profile">
            <div style={{ marginBottom: 48, display: "flex", alignItems: 'center', justifyContent: 'space-between' }}>
                <h2>Profile</h2>
                <Link to='/'>
                    <FontAwesomeIcon icon={faCaretLeft} />
                    Home
                </Link>
            </div>
            {isEdit ? (
                <form className="edit-form profile-edit-form profile-child">
                    <div className="edit">
                        <input type="text" value={newUsername} className="task-input" onChange={(e) => setNewUsername(e.target.value)} />
                        <input type="email" value={newEmail} className="task-input" onChange={(e) => setNewEmail(e.target.value)} />
                    </div>
                    <div className="edit-btns">
                        <button onClick={handleSave} className="save-btn">Save</button>
                        <button onClick={() => setEdit(false)} className="cancel-btn">Cancel</button>
                    </div>

                </form>
            ) : (
                <div className="user-details profile-child">
                    <div>
                        <p>{userDetails.username}</p>
                        <p>{userDetails.email}</p>
                    </div>
                    <button className="edit-btn" onClick={handleEdit}>Edit Details</button>
                </div>
            )}

            <div className="profile-tasks">
                {tasksData.length > 0 ? (
                    tasksData.map((task) => (
                        <Task {...task} key={task._id} limitedDesc={false} />
                    ))
                ) : (
                    <p>No tasks found.</p>
                )}

            </div>
        </div>
    )
}

export default Profile