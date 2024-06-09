const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cron = require('node-cron');

const app = express();
const cookieParser = require("cookie-parser");
const { sendRemainderEmail } = require('./Controllers/emailController');
const authRoute = require("./Routes/AuthRoute");

//Models
const Task = require('./models/Task')
const User = require('./Models/UserModel')

//Middleware
const { isAuthenticated } = require('./Middleware/AuthMiddleware')

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200,

}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(isAuthenticated)
app.use("/", authRoute);


mongoose.connect('mongodb://127.0.0.1:27017/TaskNotifier', {
    useNewUrlParser: true
})

//Scheduling Reminders for overdued tasks
cron.schedule('* 9 * * *', async () => {
    console.log('Running scheduled task check at', new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    const now = new Date();
    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0);

    const tomorrowMidnight = new Date(todayMidnight);
    tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);

    const tasksDueTomorrow = await Task.find({
        taskDate: {
            $gte: tomorrowMidnight,
            $lt: new Date(tomorrowMidnight.getTime() + 24 * 60 * 60 * 1000)
        }
    }).populate('userId');

    const overdueTasks = await Task.find({
        taskDate: {
            $lt: todayMidnight
        }
    }).populate('userId');

    tasksDueTomorrow.forEach(task => {
        const { userId, taskTitle, taskDate } = task;
        const { email } = userId;
        const subject = 'Task Reminder: Due Tomorrow';
        const text = `This is a reminder that your task "${taskTitle}" is due on ${taskDate.toDateString()}.`;
        const html = `<p>This is a reminder that your <strong>task</strong> "${taskTitle}" is due on ${taskDate.toDateString()}.</p>`;

        sendRemainderEmail(email, subject, text, html);
    });

    overdueTasks.forEach(task => {
        const { userId, taskTitle, taskDate } = task;
        const { email } = userId;
        const subject = 'Task Reminder: Overdue Task';
        const text = `This is a reminder that your task "${taskTitle}" was due on ${taskDate.toDateString()}. Please complete it as soon as possible.`;
        const html = `<p>This is a reminder that your <strong>task</strong> "${taskTitle}" was due on ${taskDate.toDateString()}. Please complete it as soon as possible.</p>`;

        sendRemainderEmail(email, subject, text, html);
    });
}, {
    timezone: "Asia/Kolkata" // IST timezone
});

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
    console.log("Task Deleted:", id)
    Task.findByIdAndDelete(id)
        .then((deletedTask) => {
            res.status(200).json('Task Deleted')
        })
        .catch((e) => console.log(e))
})

app.post('/searchtask', (req, res) => {
    const { query } = req.body.params;
    const userId = req.userId
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: No user ID provided' });
    }
    Task.find({
        userId: userId,
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

app.post('/updateuser', (req, res) => {
    const userId = req.userId
    const { newUsername, newEmail } = req.body

    User.findByIdAndUpdate(userId, { username: newUsername, email: newEmail }, { new: true, runValidators: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found.' });
            }
            res.status(200).json(updatedUser);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while updating user details.' });
        });

})
app.listen(4000, () => {
    console.log(`Server on 4000`);
});