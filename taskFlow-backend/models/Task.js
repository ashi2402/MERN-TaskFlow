const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    id:{
        type: Number,
        require: true,
        unique: true
    },
    title: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    prority: {
        type:String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
