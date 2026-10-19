const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const Task = require('./models/Task');

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173'
}))


app.use(express.json());


// Serve the production React build.
const frontendPath = path.join(
    __dirname,
    '../taskflow-frontend/dist'
);

app.use(express.static(frontendPath));

// Send React's index.html for frontend routes,
// but never use this fallback for API requests.
app.get(/^(?!\/api(?:\/|$)).*/, (req, res, next) => {
    res.sendFile(path.join(frontendPath, 'index.html'), err => {
        if (err) next(err);
    });
});

app.get('/api/tasks', async (req, res) => {
    try{
        const tasks = await Task.find();

        res.status(200).json(tasks)
        
    }catch(error){
         console.error('Error fetching tasks:', error);
        res.status(500).json({
            message: 'Failed to fetch tasks'
        });
    }

})

app.get('/api/health', (req, res) => {
    res.status(200).json({
        message: 'TaskFlow API is running'
    })
})

app.post('/api/tasks', async (req, res) => {
    try {

        const { title, description, priority, status } = req.body;
    
        if (!title || !title.trim()) {
            res.status(400).json({
                message: "Task title is required"
            })
        }
    
        const newTask = await Task.create({
            id: Date.now(),
            title: title,
            description: description || '',
            priority: priority || 'Medium',
            status: status || 'Pending'
    
        });
    
        res.status(201).json(newTask)

    }catch(error){
         console.error('Error creating task:', error);

        if (
            error.name === 'ValidationError' ||
            error.code === 11000
        ) {
            return res.status(400).json({
                message: 'Invalid task data or duplicate task ID'
            });
        }

        res.status(500).json({
            message: 'Failed to create task'
        });
    }
})

app.patch('/api/tasks/:id', async (req, res) => {

    try {

        const taskId = Number(req.params.id);
    
        const { status } = req.body;
    
        if(!Number.isSafeInteger(taskId)){
            return res.status(400).kson({
                message: 'Invalid task ID'
            })
        }
    
        if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid task status'
            });
        }
        
        const updatedTask = await Task.findOneAndUpdate(
            {id: taskId},
            {$set: {status}},
            {returnDocument: true, runValidators: true}
        );
    
       if (!updatedTask) {
    return res.status(404).json({
        message: 'Task not found'
    });
}

return res.status(200).json(updatedTask);
    }catch(error){
        console.error('Error updating task:', error);
        res.status(500).json({
            message: 'Failed to update task'
        });
    
    }
});

app.delete('/api/tasks/:id', async (req, res) => {

    try {

        const taskId = Number(req.params.id);
    
         if(!Number.isSafeInteger(taskId)){
                return res.status(400).json({
                    message: 'Invalid task ID'
                })
            }
    
    
        const deletedTask = await Task.findOneAndDelete({
            id: taskId
        });
    
         if (!deletedTask) {
                return res.status(404).json({
                    message: 'Task not found'
                });
            }
    
        res.status(200).json({
            message: 'Task deleted successfully',
            task: deletedTask
        });
    }catch(error){
         console.error('Error deleting task:', error);

        return res.status(500).json({
            message: 'Failed to delete task'
        });
    }

})

//Added cooment to check auto deployment

async function startServer(){
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB connected succesfully');

        app.listen(PORT, () => {
            console.log(`TaskFlow API is running on ${PORT}`)
        })

    }catch(error){
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
}

startServer();

