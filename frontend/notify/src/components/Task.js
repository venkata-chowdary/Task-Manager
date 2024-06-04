import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Task(props) {
    const currentDate = new Date();
    const taskDate = new Date(props.taskDate.split('T')[0]);
    const timeDifference = taskDate - currentDate;
    const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    const [isEdit, setEdit] = useState(false);

    const tagsList=props.tags[0].split(' ').map(tag=>tag.trim())

    const [editData, seteditData] = useState({
        taskTitle: '',
        taskDescription: '',
        tags: []
    });


    function handleChange(e) {
        const { name, value } = e.target
        seteditData((prevData) => ({
            ...prevData, [name]: value
        }))
    }

    function handleTagChange(e) {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        seteditData((prevData) => ({
            ...prevData, tags: tags
        }));
    }

    function handleEdit() {
        setEdit(true);
        axios.get(`http://localhost:4000/geteditdata/${props._id}`)
            .then((response) => {
                seteditData({
                    taskTitle: response.data.taskTitle,
                    taskDescription: response.data.taskDescription,
                    tags: response.data.tags.join(', ')
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleSave(e) {
        e.preventDefault();

        axios.post(`http://localhost:4000/edittask/${props._id}`, editData, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    setEdit(false);
                    toast.success('Task updated');
                } else {
                    toast.error('Task not updated');
                }
            })
            .then(() => props.setreRenderSidebar(prev => !prev))
            .catch((err) => {
                console.log(err);
            });
    }

    function handleDelete() {
        axios.post(`http://localhost:4000/deletetask/${props._id}`, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    props.setreRenderSidebar(prev => !prev);
                    toast.success('Task deleted');
                } else {
                    toast.error('Task not deleted');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="task">
            {isEdit ?
                <form onSubmit={handleSave} className="edit-form">
                    <div>
                        <input
                            type="text"
                            placeholder="Task"
                            className="task-input"
                            name="taskTitle"
                            value={editData.taskTitle}
                            onChange={handleChange}
                        />
                        <textarea
                            rows={2}
                            className="description"
                            placeholder="Description"
                            name="taskDescription"
                            value={editData.taskDescription}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="Tags (comma separated)"
                            className="task-input"
                            name="tags"
                            value={editData.tags}
                            onChange={handleTagChange}
                        />
                    </div>

                    <div className="edit-btns">
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEdit(false)}>Cancel</button>
                    </div>
                </form>
                :

                <div>
                    <div className="task-desc">
                        <h2>{props.taskTitle}</h2>
                        <p>{props.taskDescription.slice(0,26)}...</p>
                        {props.tags && props.tags.length > 0 && (
                            <div className="tags">
                                {tagsList.map((tag, index) => (
                                    <span key={index} className="tag">#{tag} </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="task-btns">
                        <button onClick={handleEdit} className="edit-btn">Edit</button>
                        <div style={{ display: 'flex', alignItems: 'baseline', flexDirection: 'row', gap: 8 }}>
                            <button onClick={handleDelete} className="delete-btn">Delete</button>
                            <p style={{ color: 'red', margin: 0 }}>{remainingDays} days left</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Task;
