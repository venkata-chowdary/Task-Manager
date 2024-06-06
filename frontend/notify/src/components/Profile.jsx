import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../Context/UserContext"
import Task from "./Task"

function Profile() {
    const { userDetails } = useContext(UserContext)
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

    function handleSave() {

    }

    if (!userDetails) {
        return <div>Loading...</div>;
    }



    return (
        <div className="profile">
            <h2>Profile</h2>
            {isEdit ? (
                <form className="edit-form profile-edit">
                    <div className="edit">
                        <input type="text" value={newUsername} className="task-input" onChange={(e) => setNewUsername(e.target.value)} />
                        <input type="email" value={newEmail} className="tasak-input" onChange={(e) => setNewEmail(e.target.value)} />
                    </div>
                    <div className="edit-btns">
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setEdit(false)}>Cancel</button>
                    </div>

                </form>
            ) : (
                <div className="user-details">
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