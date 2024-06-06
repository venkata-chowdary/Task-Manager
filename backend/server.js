const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express();
const cookieParser = require("cookie-parser");

const authRoute = require("./Routes/AuthRoute");

//Models
const Task = require('./models/Task')

//Middleware
const { isAuthenticated } = require('./Middleware/AuthMiddleware')

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(isAuthenticated)
app.use("/", authRoute);


mongoose.connect('mongodb://127.0.0.1:27017/TaskNotifier', {
    useNewUrlParser: true
})


app.post('/createtask', (req, res) => {
    const { taskTitle, taskDescription, taskDate, tags } = req.body
    const newTask = new Task({
        taskTitle: taskTitle,
        taskDescription: taskDescription,
        taskDate: taskDate,
        tags: tags,
        userId: req.userId
    })
    newTask.save()
        .then(() => {
            console.log('task saved')
            res.status(200).json({ message: 'task saved' })
        })
        .catch((err) => console.log(err))
})

app.get('/gettasksdata', (req, res) => {
    const userId = req.userId
    Task.find({ userId })
        .then((taskData) => {
            res.status(200).send(taskData)
        })
        .catch((err) => {
            console.log(err)
        })
})

app.post('/geteditdata/:id', (req, res) => {

    const { id } = req.params

    Task.findById(id)
        .then((taskData) => {
            res.status(200).json(taskData)
        })
        .catch(e => console.log(e))
})

app.post('/edittask/:id', (req, res) => {
    const { id } = req.params
    const newData = req.body

    Task.findByIdAndUpdate(id, newData, { new: true })
        .then((updatedTask) => {
            res.status(200).json('task updated successfully')
        })
        .catch((e) => console.log(e))
})

app.post('/deletetask/:id', (req, res) => {
    const id = req.params.id
    console.log("Task Deleted:",id)
    Task.findByIdAndDelete(id)
        .then((deletedTask) => {
            res.status(200).json('Task Deleted')
        })
        .catch((e) => console.log(e))
})

app.post('/searchtask', (req, res) => {
    const { query } = req.body.params;

    Task.find({
        $or: [
            { taskTitle: { $regex: query, $options: 'i' } }, // Search by title
            { tags: { $regex: query, $options: 'i' } }      // Search by tag
        ]
    })
        .then(tasks => {
            res.json(tasks);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while searching for tasks' });
        });
});

app.listen(4000, () => {
    console.log(`Server on 4000`);
});