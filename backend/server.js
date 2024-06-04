const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')


const app = express();


const Task=require('./models/Task')

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
}


app.use(cors(corsOptions));
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/TaskNotifier', {
    useNewUrlParser: true
})


app.post('/createtask',(req,res)=>{
    res.send('received')
    const {taskTitle,taskDescription,taskDate}=req.body
    
    const newTask=new Task({
        taskTitle:taskTitle,
        taskDescription:taskDescription,
        taskDate:taskDate
    })
    newTask.save()
    .then(()=>console.log('task saved'))
    .catch((err)=>console.log(err))
})

app.get('/gettasksdata',(req,res)=>{
    Task.find({})
    .then((taskData)=>{
        res.status(200).send(taskData)
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.get('/geteditdata/:id',(req,res)=>{

    console.log(req.params)
    const {id}=req.params

    Task.findById(id)
    .then((taskData)=>{
        res.status(200).json(taskData)
    })
    .catch(e=>console.log(e))
})

app.post('/edittask/:id',(req,res)=>{
    const {id}=req.params
    const newData=req.body
    Task.findByIdAndUpdate(id,newData,{new:true})
    .then((updatedTask)=>{
        res.status(200).json('task updated successfully')
    })
    .catch((e)=>console.log(e))
})

app.post('/deletetask/:id',(req,res)=>{
    
    const id=req.params.id 
    console.log(id)
    Task.findByIdAndDelete(id)
    .then((deletedTask)=>{
        res.status(200).json('Task Deleted')
    })
    .catch((e)=>console.log(e))
})

app.get('/searchtask',(req,res)=>{
    const {taskTitle}=req.query

    Task.find({taskTitle:{ $regex:taskTitle, $options:'i'}})
    .then(tasks => {
        console.log(tasks)
        res.json(tasks);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while searching for tasks' });
    });
})
app.listen(4000, () => {
    console.log(`Server on 4000`);
});