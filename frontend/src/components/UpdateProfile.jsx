// src/components/UpdateProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const UpdateProfile = () => {
    const { currentUser, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile form data
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        bio: ''
    });

    // Password form data
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form errors
    const [errors, setErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});

    // Show/hide password section
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setProfileData({
                username: currentUser.username || '',
                email: currentUser.email || '',
                bio: currentUser.bio || ''
            });
        }
    }, [currentUser]);

    // Validation functions
    const validateProfileForm = () => {
        const newErrors = {};

        if (!profileData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (profileData.username.length < 3 || profileData.username.length > 30) {
            newErrors.username = "Username must be 3-30 characters";
        }

        if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (profileData.bio && profileData.bio.length > 500) {
            newErrors.bio = "Bio cannot exceed 500 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordForm = () => {
        const newErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = "New password is required";
        } else {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(passwordData.newPassword)) {
                newErrors.newPassword = "Must be 8+ chars with uppercase, lowercase, number";
            }
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required";
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setPasswordErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate individual fields on change
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'username':
                if (!value.trim()) {
                    error = "Username is required";
                } else if (value.length < 3 || value.length > 30) {
                    error = "Username must be 3-30 characters";
                }
                break;

            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = "Please enter a valid email";
                }
                break;

            case 'bio':
                if (value && value.length > 500) {
                    error = "Bio cannot exceed 500 characters";
                }
                break;

            case 'newPassword':
                if (!value) {
                    error = "New password is required";
                } else {
                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
                    if (!passwordRegex.test(value)) {
                        error = "Must be 8+ chars with uppercase, lowercase, number";
                    }
                }
                break;

            case 'currentPassword':
                if (!value) {
                    error = "Current password is required";
                }
                break;

            case 'confirmPassword':
                if (!value) {
                    error = "Confirm password is required";
                } else if (passwordData.newPassword && value !== passwordData.newPassword) {
                    error = "Passwords do not match";
                }
                break;

            default:
                break;
        }

        return error;
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });

        // Validate field and update errors
        const error = validateField(name, value);
        if (error) {
            setErrors({
                ...errors,
                [name]: error
            });
        } else {
            // Clear error for this field
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });

        // Validate field and update errors
        const error = validateField(name, value);

        // Special handling for confirm password when new password changes
        if (name === 'newPassword' && passwordData.confirmPassword && passwordData.confirmPassword !== value) {
            setPasswordErrors({
                ...passwordErrors,
                [name]: error,
                confirmPassword: "Passwords do not match"
            });
        } else if (error) {
            setPasswordErrors({
                ...passwordErrors,
                [name]: error
            });
        } else {
            // Clear error for this field
            const newErrors = { ...passwordErrors };
            delete newErrors[name];

            // Also clear confirm password error if passwords now match
            if (name === 'newPassword' && passwordData.confirmPassword === value) {
                delete newErrors.confirmPassword;
            } else if (name === 'confirmPassword' && passwordData.newPassword === value) {
                delete newErrors.confirmPassword;
            }

            setPasswordErrors(newErrors);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!validateProfileForm()) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            // Update user in context and localStorage
            login(data, token);
            setMessage({
                type: 'success',
                text: 'Profile updated successfully!'
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!validatePasswordForm()) return;

        setPasswordLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/profile/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            setMessage({
                type: 'success',
                text: data.message || 'Password changed successfully!'
            });

            // Reset password form
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setPasswordErrors({});

        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message
            });
        } finally {
            setPasswordLoading(false);
        }
    };

    // Toggle password section
    const togglePasswordSection = () => {
        setShowPasswordSection(!showPasswordSection);
        // Reset password form when closing
        if (showPasswordSection) {
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setPasswordErrors({});
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10 col-xl-8">
                    <div className="auth-card animation-slide-up">
                        <div className="auth-header">
                            <h2 className="typography-heading">
                                <i className="bi bi-person-circle me-2"></i>
                                Update Profile
                            </h2>
                        </div>

                        <div className="auth-body">
                            {message.text && (
                                <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} animation-fade-in mb-4`}>
                                    <i className={`bi bi-${message.type === 'error' ? 'exclamation-triangle' : 'check-circle'} me-2`}></i>
                                    {message.text}
                                </div>
                            )}

                            {/* Profile Update Form */}
                            <form onSubmit={handleProfileSubmit} className="mb-4">
                                <div className="row">
                                    {/* Username */}
                                    <div className="col-12 col-md-6 mb-4">
                                        <div className="form-group-floating">
                                            <input
                                                type="text"
                                                className={`form-control-floating ${errors.username ? 'error' : ''}`}
                                                id="username"
                                                name="username"
                                                placeholder=" "
                                                value={profileData.username}
                                                onChange={handleProfileChange}
                                                maxLength="30"
                                            />
                                            <label className="label-floating">
                                                <i className="bi bi-person me-2"></i>Username
                                            </label>
                                            {errors.username && <div className="form-error">{errors.username}</div>}
                                            <div className="form-text-small">3-30 characters, must be unique</div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="col-12 col-md-6 mb-4">
                                        <div className="form-group-floating">
                                            <input
                                                type="email"
                                                className={`form-control-floating ${errors.email ? 'error' : ''}`}
                                                id="email"
                                                name="email"
                                                placeholder=" "
                                                value={profileData.email}
                                                onChange={handleProfileChange}
                                            />
                                            <label className="label-floating">
                                                <i className="bi bi-envelope me-2"></i>Email
                                            </label>
                                            {errors.email && <div className="form-error">{errors.email}</div>}
                                            <div className="form-text-small">Optional, used for notifications</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bio - Full width */}
                                <div className="row">
                                    <div className="col-12 mb-4">
                                        <div className="form-group-floating">
                                            <textarea
                                                className={`form-control-floating ${errors.bio ? 'error' : ''}`}
                                                id="bio"
                                                name="bio"
                                                placeholder=" "
                                                rows={3}
                                                value={profileData.bio}
                                                onChange={handleProfileChange}
                                                maxLength="500"
                                            ></textarea>
                                            <label className="label-floating">
                                                <i className="bi bi-chat-text me-2"></i>Bio
                                            </label>
                                            {errors.bio && <div className="form-error">{errors.bio}</div>}
                                            <div className="form-text-small d-flex justify-content-between">
                                                <span>Tell us about yourself</span>
                                                <span>{profileData.bio.length}/500</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Update Profile Button */}
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <button
                                            type="submit"
                                            className="btn-primary-gradient w-100 py-3 btn-glow"
                                            disabled={loading}
                                        >
                                            <i className="bi bi-check-circle me-2"></i>
                                            {loading ? 'Updating...' : 'Update Profile'}
                                        </button>
                                    </div>
                                </div>

                                {/* Toggle Password Section Button */}
                                <div className="row">
                                    <div className="col-12">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary w-100 py-3 d-flex align-items-center justify-content-center"
                                            onClick={togglePasswordSection}
                                        >
                                            <i className={`bi bi-chevron-${showPasswordSection ? 'up' : 'down'} me-2`}></i>
                                            {showPasswordSection ? 'Hide Password Change' : 'Change Password'}
                                            <i className={`bi bi-chevron-${showPasswordSection ? 'up' : 'down'} ms-2`}></i>
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Password Change Section - Initially Hidden */}
                            {showPasswordSection && (
                                <div className="mt-4 pt-4 border-top animation-slide-up">
                                    <form onSubmit={handlePasswordSubmit}>
                                        <h4 className="typography-subheading mb-4 text-gradient-primary">
                                            <i className="bi bi-shield-lock me-2"></i>
                                            Change Password
                                        </h4>

                                        <div className="row">
                                            {/* Current Password */}
                                            <div className="col-12 mb-4">
                                                <div className="form-group-floating">
                                                    <input
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        className={`form-control-floating ${passwordErrors.currentPassword ? 'error' : ''}`}
                                                        id="currentPassword"
                                                        name="currentPassword"
                                                        placeholder=" "
                                                        value={passwordData.currentPassword}
                                                        onChange={handlePasswordChange}
                                                    />
                                                    <label className="label-floating">
                                                        <i className="bi bi-lock me-2"></i>Current Password
                                                    </label>
                                                    {passwordErrors.currentPassword && <div className="form-error">{passwordErrors.currentPassword}</div>}
                                                    <span
                                                        className="form-toggle-password"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    >
                                                        <i className={showCurrentPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            {/* New Password */}
                                            <div className="col-12 mb-4">
                                                <div className="form-group-floating">
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        className={`form-control-floating ${passwordErrors.newPassword ? 'error' : ''}`}
                                                        id="newPassword"
                                                        name="newPassword"
                                                        placeholder=" "
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordChange}
                                                        minLength="8"
                                                    />
                                                    <label className="label-floating">
                                                        <i className="bi bi-lock-fill me-2"></i>New Password
                                                    </label>
                                                    {passwordErrors.newPassword && <div className="form-error">{passwordErrors.newPassword}</div>}
                                                    <span
                                                        className="form-toggle-password"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                    >
                                                        <i className={showNewPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                                    </span>
                                                    <div className="form-text-small">
                                                        Must be 8+ characters with uppercase, lowercase, and number
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            {/* Confirm Password */}
                                            <div className="col-12 mb-4">
                                                <div className="form-group-floating">
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        className={`form-control-floating ${passwordErrors.confirmPassword ? 'error' : ''}`}
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        placeholder=" "
                                                        value={passwordData.confirmPassword}
                                                        onChange={handlePasswordChange}
                                                        minLength="8"
                                                    />
                                                    <label className="label-floating">
                                                        <i className="bi bi-lock-fill me-2"></i>Confirm New Password
                                                    </label>
                                                    {passwordErrors.confirmPassword && <div className="form-error">{passwordErrors.confirmPassword}</div>}
                                                    <span
                                                        className="form-toggle-password"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Change Password Button */}
                                        <div className="row">
                                            <div className="col-12">
                                                <button
                                                    type="submit"
                                                    className="btn-danger-gradient w-100 py-3 btn-glow"
                                                    disabled={passwordLoading}
                                                >
                                                    <i className="bi bi-key me-2"></i>
                                                    {passwordLoading ? 'Changing...' : 'Change Password'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;