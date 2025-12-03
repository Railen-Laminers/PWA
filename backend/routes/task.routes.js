// routes/task.routes.js
import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Create new task
// @route   POST /api/tasks
router.post('/', auth, async (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const task = new Task({
            title,
            description: description || '',
            userId: req.user.id
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update task
// @route   PUT /api/tasks/:id
router.put('/:id', auth, async (req, res) => {
    const { title, description, completed } = req.body;

    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Ensure user owns the task
        if (task.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.completed = completed !== undefined ? completed : task.completed;

        await task.save();
        res.json(task);
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
