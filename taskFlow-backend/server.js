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

app.listen(PORT, () => {
    console.log(`TaskFlow API is running on ${PORT}`)
})