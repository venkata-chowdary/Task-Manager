import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faL, faTimes, faSort } from '@fortawesome/free-solid-svg-icons';
import Task from "./Task";
import axios from 'axios';
import { toast } from "react-toastify";

function SideBar(props) {
    const [toggle, setToggle] = useState(false);
    const [tasksData, settasksData] = useState([]);
    const [sortByRemainingDays, setSortByRemainingDays] = useState(false)
    const [reRenderState, setReRenderState] = useState(false)
    const [searchTask,setSearchTask]=useState('')

    function sideBarToggle() {
        setToggle(!toggle);
    }

    useEffect(() => {
        axios.get('http://localhost:4000/gettasksdata', { withCredentials: true })
            .then((response) => {
                settasksData(response.data);
                setReRenderState(true)
            })
            .catch((err) => {
                console.log(err);
            });
    }, [props.reRenderSidebar]);

    useEffect(() => {
        console.log('notified')
        notifyTask(tasksData)
    }, [reRenderState])

    function notifyTask(tasks) {
        const currentDate = new Date();
        tasks.forEach((task) => {
            const taskDate = new Date(task.taskDate);
            const timeDifference = taskDate - currentDate;
            const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
            if (remainingDays === 1) {
                // toast.warn(`Task Reminder: ${task.taskTitle}, You have 1 day left to complete your task`);
            } else if (remainingDays < 1) {
                // toast.error(`${task.taskTitle} is overdue! Please complete it as soon as possible`);
            }
        });
    }

    const sortedTasksData = [...tasksData].sort((a, b) => {
        const currentDate = new Date();
        const remainingDaysA = Math.ceil((new Date(a.taskDate) - currentDate) / (1000 * 60 * 60 * 24));
        const remainingDaysB = Math.ceil((new Date(b.taskDate) - currentDate) / (1000 * 60 * 60 * 24));
        return sortByRemainingDays ? remainingDaysA - remainingDaysB : 0;
    });

    function handleSearch(e){
        const query=e.target.value
        // setSearchTask(taskTitle)
        axios.get('http://localhost:4000/searchtask',{params:{query}},{withCredentials:true})
        .then((res)=>{
            settasksData(res.data)
        })
        .catch((err)=>console.log(err))
    }

    return (
        <div>
            <button onClick={sideBarToggle} className={`toggle-btn ${toggle ? 'open' : 'closed'}`}>
                {toggle ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
            </button>
            <div className={`sidebar-container ${toggle ? 'open' : 'closed'}`}>
                {toggle && (
                    <div className="sidebar">
                        <div className="sidebar-header">
                            <input type="text" placeholder="Search Task" className="search-task" onChange={handleSearch}/>
                            <button onClick={() => setSortByRemainingDays(!sortByRemainingDays)}>
                                {sortByRemainingDays ? (<FontAwesomeIcon icon={faSort} />
                                ) : (<>
                                    <FontAwesomeIcon icon={faSort} />
                                </>)}
                            </button>
                        </div>
                        {sortedTasksData.map((task) => (
                            <Task {...task} key={task._id} setreRenderSidebar={props.setreRenderSidebar} />
                        ))}
                    </div>
                )}
                {toggle && <div className="overlay"></div>}
            </div>
        </div>
    );
}

export default SideBar;
