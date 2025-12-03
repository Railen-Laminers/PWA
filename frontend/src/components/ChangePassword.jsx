// src/components/ChangePassword.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ChangePassword = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/profile/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            setMessage({ type: 'success', text: data.message });
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = (password) => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        return strength;
    };

    const strength = passwordStrength(formData.newPassword);

    return (
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden animation-slide-up">
            <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                    <div className="badge-danger badge rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                        <i className="bi bi-key"></i>
                    </div>
                    <h3 className="card-title typography-heading mb-2">Change Password</h3>
                    <p className="text-muted typography-body">Update your account password</p>
                </div>

                {message && (
                    <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} animation-fade-in`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="currentPassword" className="form-label typography-body fw-semibold">
                            <i className="bi bi-lock me-2"></i>Current Password
                        </label>
                        <input
                            type="password"
                            className="form-control form-control-lg border-2 animation-pulse"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="newPassword" className="form-label typography-body fw-semibold">
                            <i className="bi bi-lock-fill me-2"></i>New Password
                        </label>
                        <input
                            type="password"
                            className="form-control form-control-lg border-2 animation-pulse"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            minLength="8"
                        />

                        {/* Password strength indicator */}
                        {formData.newPassword && (
                            <div className="mt-2">
                                <div className="d-flex align-items-center mb-1">
                                    <small className="me-2">Strength:</small>
                                    <div className="progress flex-grow-1" style={{ height: '5px' }}>
                                        <div
                                            className={`progress-bar ${strength <= 2 ? 'bg-danger' : strength === 3 ? 'bg-warning' : 'bg-success'}`}
                                            style={{ width: `${strength * 25}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <small className={`text-${strength >= 4 ? 'success' : 'muted'}`}>
                                    Must include uppercase, lowercase, number, and be at least 8 characters
                                </small>
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label typography-body fw-semibold">
                            <i className="bi bi-lock-fill me-2"></i>Confirm New Password
                        </label>
                        <input
                            type="password"
                            className={`form-control form-control-lg border-2 animation-pulse ${formData.confirmPassword && formData.newPassword !== formData.confirmPassword ? 'is-invalid' : ''}`}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                            <div className="invalid-feedback">Passwords do not match</div>
                        )}
                    </div>

                    <div className="d-grid gap-2">
                        <button
                            type="submit"
                            className="btn btn-danger btn-lg btn-glow typography-body fw-semibold"
                            disabled={loading || formData.newPassword !== formData.confirmPassword}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Changing...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-key me-2"></i>
                                    Change Password
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;