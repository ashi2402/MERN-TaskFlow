const express = require('express');
const cors = require('cors');

const app = express();

const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173'
}))

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

app.use(express.json());


app.get('/api/tasks', (req, res) => {
    res.status(200).json(tasks)
})

app.get('/api/health', (req, res) => {
    res.status(200).json({
        message: 'TaskFlow API is running'
    })
})

app.listen(PORT, () => {
    console.log(`TaskFlow API is running on ${PORT}`)
})