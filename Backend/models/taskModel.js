import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    name: String,
    url: String,
     public_id: String,
    contentType: String,
    size: Number
});

const taskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: String,
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: Date,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    documents: [documentSchema]
}, { timestamps: true });

taskSchema.path('documents').validate(function (docs) {
    return docs.length <= 3;
}, 'Maximum 3 documents allowed');

const Task = mongoose.model('Task', taskSchema);
export default Task;


// const sampleTask = new Task({
//     title: 'Sample Task',
//     description: 'This is a sample task description',
//     status: 'todo',
//     priority: 'medium',
//     dueDate: new Date(),
//     assignedTo: "jag@gmail.com", 
// });