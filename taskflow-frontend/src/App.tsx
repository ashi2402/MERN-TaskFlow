import { useState, useEffect } from 'react';
import type { SubmitEvent } from 'react';
import Navbar from './components/Navbar';
import TaskCard from './components/TaskCard';
import './App.css';

type Task = {
  id: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
};

function App() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [priority, setPriority] =
    useState<Task['priority']>('Medium');

  const [status, setStatus] =
    useState<Task['status']>('Pending');


  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        setError('');

       const response = await fetch('/api/tasks');

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data: Task[] = await response.json();

        setTasks(data);

      } catch {
        setError('Unable to load tasks. Please try again.');
      } finally {
        setLoading(false)
      }
    }

    loadTasks();
  }, []);


  function addTask(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    const newTask: Task = {
      id: Date.now(),
      title: trimmedTitle,
      description: description.trim(),
      priority,
      status
    };

    setTasks(previousTasks => [...previousTasks, newTask]);

    setTitle('');
    setDescription('');
    setPriority('Medium');
    setStatus('Pending');
  }

  function deleteTask(id: number) {
    setTasks(prevTask => prevTask.filter(task => task.id !== id))
  }

  function markTaskCompleted(id: number) {
    setTasks(previousTasks =>
      previousTasks.map(task =>
        task.id === id
          ? { ...task, status: 'Completed' }
          : task
      )
    );
  }

  return (
    <div>
      <Navbar />
      <main>
        <form className="task-form" onSubmit={addTask}>
          <div className="form-field">
            <label htmlFor="title">Task title</label>
            <input
              id="title"
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={event => setDescription(event.target.value)}
              placeholder="Describe the task"
            />
          </div>
          <div className="form-field">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={event =>
                setPriority(event.target.value as Task['priority'])
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={event =>
                setStatus(event.target.value as Task['status'])
              }
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Apply the same form-field wrapper to Priority and Status. */}

          <div className="form-actions">
            <button className="button button-primary" type="submit">
              Add Task
            </button>
          </div>
        </form>
        <h2>My Tasks</h2>
        {loading && <p>Loading tasks...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && tasks.length === 0 && (
          <p>No tasks found.</p>
        )}
        {!loading && !error && (

        <div className="task-list">
          {tasks.map(task => (
            <div className="task-item" key={task.id}>
              <TaskCard
                title={task.title}
                status={task.status}
                onMarkCompleted={() => markTaskCompleted(task.id)}
              />

              <p className="task-description">
                {task.description}
              </p>

              <div className="task-meta">
                <span className="task-badge">
                  {task.priority}
                </span>

                <span className="task-badge">
                  {task.status}
                </span>
              </div>

              <div className="task-actions">
                <button
                  className="button button-danger"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        )}

      </main>
    </div>
  );
}

export default App;