// routes/profile.routes.js
import express from 'express';
import auth from '../middleware/auth.middleware.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/profile
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update user profile
// @route   PUT /api/profile
router.put('/', auth, async (req, res) => {
    try {
        const { username, email, bio } = req.body;

        // Check if username is being changed and if it's available
        if (username && username !== req.user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }
        }

        // Check if email is being changed and if it's available
        if (email && email !== req.user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                username: username || req.user.username,
                email: email || req.user.email,
                bio: bio || req.user.bio
            },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (error) {
        console.error('Update profile error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Change password
// @route   PUT /api/profile/password
// routes/profile.routes.js - password route (add error handling)
router.put('/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Find user with password (select password explicitly)
        const user = await User.findById(req.user._id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Validate new password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters with one uppercase, one lowercase, and one number'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        // Add specific error handling
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
