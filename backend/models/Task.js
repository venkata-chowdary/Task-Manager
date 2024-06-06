const mongoose=require('mongoose')


const TaskSchema=new mongoose.Schema({
    taskTitle:{type:String,required:true},
    taskDescription:{type:String},
    taskDate:{type:Date,required:true},
    tags:{type:[String]},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Add userId field

})


const Task=mongoose.model('Task',TaskSchema)

module.exports=Task