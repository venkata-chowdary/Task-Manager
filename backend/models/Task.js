const mongoose=require('mongoose')


const TaskSchema=new mongoose.Schema({
    taskTitle:{type:String,required:true},
    taskDescription:{type:String},
    taskDate:{type:Date,required:true}
})


const Task=mongoose.model('Task',TaskSchema)

module.exports=Task