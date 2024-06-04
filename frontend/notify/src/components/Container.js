import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Task from './Task';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';



function Container(props) {

    const [taskTitle, setTaskName] = useState('');
    const [taskDescription, setDescription] = useState('');
    const [taskDate, setDate] = useState('');
    const [tasksData, settasksData] = useState([]);
    const [toggle, setToggle] = useState(true)

    const handleTaskNameChange = (e) => setTaskName(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleDateChange = (e) => setDate(e.target.value);

    const currentDate = new Date()


    useEffect(() => {
        axios.get('http://localhost:4000/gettasksdata', { withCredentials: true })
            .then((response) => {
                // settasksData(response.data);
                const filtered=response.data.filter(task => new Date(task.taskDate)<currentDate)
                settasksData(filtered)

            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!taskTitle.trim() || !taskDate) {
            toast.error('All fields are required.');
            return;
        }

        if (currentDate.toISOString().split('T')[0] <= taskDate) {
            const newTask = { taskTitle, taskDescription, taskDate };
            axios.post('http://localhost:4000/createtask', newTask, { withCredentials: true })
                .then((response) => {
                    if (response.status === 200) {
                        toast.success('Task created successfully!');
                    }
                })
                .then(() => props.setreRenderSidebar(prev => !prev))
                .catch((err) => {
                    console.log(err)
                    toast.error('Failed to create task. Please try again.');
                })
        }
        else {
            toast.error('Task date must be a future date.');
        }

        setTaskName('');
        setDescription('');
        setDate('');
    };

    return (
        <div className="container">
            <h1>Task Manager</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Task"
                    className="task-input"
                    value={taskTitle}
                    onChange={handleTaskNameChange}
                />
                <textarea
                    rows={6}
                    className="description"
                    placeholder="Description"
                    value={taskDescription}
                    onChange={handleDescriptionChange}
                />
                <input
                    type="date"
                    value={taskDate}
                    onChange={handleDateChange}
                />
                <button type="submit">Add Task</button>
            </form>

            <div className='pending-tasks'>
                <button className="toggle-button" onClick={() => setToggle(!toggle)}>
                    <FontAwesomeIcon icon={faExclamationCircle} style={{ fontSize: 14 }} />
                    <h2>Pending Tasks</h2>
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

            <ToastContainer />
        </div>
    );
}

export default Container;
