const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173'
}))


app.use(express.json());

const tasks = [
    {
        id: 1,
        title: 'Fix login bug',
        description: 'Resolve the login validation issue',
        priority: 'High',
        status: 'Pending'
    },
    {
        id: 2,
        title: 'Build dashboard',
        description: 'Create the project overview',
        priority: 'Medium',
        status: 'In Progress'
    }
];

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

app.get('/api/tasks', (req, res) => {
    res.status(200).json(tasks)
})

app.get('/api/health', (req, res) => {
    res.status(200).json({
        message: 'TaskFlow API is running'
    })
})

app.post('/api/tasks', (req, res) => {
    const { title, description, priority, status } = req.body;

    if (!title || !title.trim()) {
        res.status(400).json({
            message: "Task title is required"
        })
    }

    const newTask = {
        id: Date.now(),
        title: title,
        description: description || '',
        priority: priority || 'Medium',
        status: status || 'Pending'

    }

    tasks.push(newTask);
    res.status(201).json(newTask)
})

app.patch('/api/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);

    const task = tasks.find(item => item.id === taskId);

    if (!task) {
        return res.status(404).json({
            message: 'Task not found'
        });
    }

    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({
            message: 'Invalid task status'
        });
    }

    task.status = status;

    res.status(200).json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);

    const taskIndex = tasks.findIndex(
        task => task.id === taskId
    );



    if (taskIndex === -1) {
        return res.status(404).json({
            message: 'Task not found'
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0]
    res.status(200).json({
        message: 'Task deleted successfully',
        task: deletedTask
    });

})


app.listen(PORT, () => {
    console.log(`TaskFlow API is running on ${PORT}`)
})