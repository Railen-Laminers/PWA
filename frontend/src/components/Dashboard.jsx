import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
} from '../utils/api';

export default function Dashboard() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', completed: false });

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await fetchTasks();
            setTasks(data);
        } catch (err) {
            setError('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;

        try {
            const task = await createTask(newTask.title, newTask.description);
            setTasks([...tasks, task]);
            setNewTask({ title: '', description: '' });
        } catch (err) {
            setError('Failed to create task');
        }
    };

    const handleUpdate = async (id) => {
        try {
            const updated = await updateTask(id, editForm);
            setTasks(tasks.map(t => (t._id === id ? updated : t)));
            setEditingId(null);
        } catch (err) {
            setError('Failed to update task');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await deleteTask(id);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (err) {
            setError('Failed to delete task');
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            const updated = await updateTask(task._id, { completed: !task.completed });
            setTasks(tasks.map(t => (t._id === task._id ? updated : t)));
        } catch (err) {
            setError('Failed to update task status');
        }
    };

    const startEdit = (task) => {
        setEditingId(task._id);
        setEditForm({
            title: task.title,
            description: task.description || '',
            completed: task.completed
        });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!currentUser) return null;

    return (
        <div className="min-vh-100">
            <div className="container py-4">

                {/* Welcome Card */}
                <div className="card shadow-elevated mb-4">
                    <div className="card-header-gradient card-header">
                        <h4 className="mb-0 typography-subheading">
                            <i className="bi bi-columns-gap pe-2"></i>Overview
                        </h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <div className="card-stats card-stats-completed">
                                    <div className="card-body text-center">
                                        <h5 className="card-title typography-subheading">
                                            <i className="bi bi-check2-circle me-2"></i>
                                            Completed
                                        </h5>
                                        <h2 className="display-4 typography-heading">
                                            {tasks.filter(t => t.completed).length}
                                        </h2>
                                        <p className="typography-body opacity-90">Tasks Done</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card-stats card-stats-pending">
                                    <div className="card-body text-center">
                                        <h5 className="card-title typography-subheading">
                                            <i className="bi bi-clock me-2"></i>
                                            Pending
                                        </h5>
                                        <h2 className="display-4 typography-heading">
                                            {tasks.filter(t => !t.completed).length}
                                        </h2>
                                        <p className="typography-body opacity-90">Tasks Remaining</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card-stats card-stats-total">
                                    <div className="card-body text-center">
                                        <h5 className="card-title typography-subheading">
                                            <i className="bi bi-list-task me-2"></i>
                                            Total
                                        </h5>
                                        <h2 className="display-4 typography-heading">
                                            {tasks.length}
                                        </h2>
                                        <p className="typography-body opacity-90">All Tasks</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">

                    {/* Task Creation Form */}
                    <div className="col-lg-4 mb-4">
                        <div className="card shadow-elevated h-100">
                            <div className="card-header-gradient card-header">
                                <h5 className="mb-0 typography-subheading">
                                    <i className="bi bi-plus-circle me-2"></i>Add New Task
                                </h5>
                            </div>
                            <div className="card-body">
                                {error && <div className="alert alert-danger">{error}</div>}
                                <form onSubmit={handleCreate}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold typography-body">Task Title *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g., Practice free throws"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label typography-body">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Optional details about the task..."
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn-success-gradient w-100 py-2">
                                        <i className="bi bi-plus-lg me-1"></i>Add Task
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Task List */}
                    <div className="col-lg-8">
                        <div className="card shadow-elevated">
                            <div className="card-header-gradient card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 typography-subheading">
                                    <i className="bi bi-journal-check me-2"></i>My Sports Tasks
                                </h5>
                                <span className="badge bg-light text-primary">
                                    {tasks.filter(t => !t.completed).length} pending
                                </span>
                            </div>
                            <div className="card-body">

                                {loading && (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2 text-muted typography-body">Loading your sports tasks...</p>
                                    </div>
                                )}

                                {!loading && tasks.length === 0 && (
                                    <div className="text-center py-5">
                                        <i className="bi bi-emoji-frown display-4 text-secondary mb-3"></i>
                                        <h5 className="typography-subheading">No tasks yet!</h5>
                                        <p className="text-muted typography-body">Start by adding your first training goal above.</p>
                                    </div>
                                )}

                                {!loading && tasks.length > 0 && (
                                    <div className="list-group">
                                        {tasks.map((task) => (
                                            <div className={`task-item ${task.completed ? 'task-item-completed' : ''}`} key={task._id}>
                                                {editingId === task._id ? (
                                                    <div className="card border-warning">
                                                        <div className="card-body">
                                                            <h6 className="mb-3 text-warning typography-subheading">
                                                                <i className="bi bi-pencil me-2"></i>Editing Task
                                                            </h6>
                                                            <div className="mb-2">
                                                                <label className="form-label typography-body">Title</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={editForm.title}
                                                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                                    autoFocus
                                                                />
                                                            </div>
                                                            <div className="mb-2">
                                                                <label className="form-label typography-body">Description</label>
                                                                <textarea
                                                                    className="form-control"
                                                                    rows="2"
                                                                    value={editForm.description}
                                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                                ></textarea>
                                                            </div>
                                                            <div className="form-check mb-3">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    id={`edit-completed-${task._id}`}
                                                                    checked={editForm.completed}
                                                                    onChange={(e) => setEditForm({ ...editForm, completed: e.target.checked })}
                                                                />
                                                                <label className="form-check-label typography-body" htmlFor={`edit-completed-${task._id}`}>
                                                                    Mark as completed
                                                                </label>
                                                            </div>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    className="btn-primary-gradient btn-sm"
                                                                    onClick={() => handleUpdate(task._id)}
                                                                >
                                                                    <i className="bi bi-check2 me-1"></i>Save
                                                                </button>
                                                                <button
                                                                    className="btn btn-secondary btn-sm"
                                                                    onClick={() => setEditingId(null)}
                                                                >
                                                                    <i className="bi bi-x me-1"></i>Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex align-items-start">
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex align-items-center mb-1">
                                                                <input
                                                                    type="checkbox"
                                                                    className="task-checkbox me-2"
                                                                    checked={task.completed}
                                                                    onChange={() => handleToggleComplete(task)}
                                                                    id={`task-${task._id}`}
                                                                />
                                                                <label
                                                                    className={`form-check-label ${task.completed ? 'text-decoration-line-through text-muted' : 'fw-bold'} typography-body`}
                                                                    htmlFor={`task-${task._id}`}
                                                                >
                                                                    {task.title}
                                                                </label>
                                                                <span className={`badge-status ms-2 ${task.completed ? 'badge-status-completed' : 'badge-status-pending'}`}>
                                                                    {task.completed ? 'Completed' : 'Pending'}
                                                                </span>
                                                            </div>

                                                            {task.description && (
                                                                <p className="text-muted mb-2 ps-4 typography-body">
                                                                    <i className="bi bi-card-text me-1"></i>
                                                                    {task.description}
                                                                </p>
                                                            )}

                                                            <div className="ps-4">
                                                                <small className="text-muted typography-body">
                                                                    <i className="bi bi-calendar me-1"></i>
                                                                    Created: {new Date(task.createdAt).toLocaleDateString()}
                                                                </small>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex gap-1">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => startEdit(task)}
                                                                title="Edit task"
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(task._id)}
                                                                title="Delete task"
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}