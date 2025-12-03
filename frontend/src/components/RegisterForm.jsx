import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (!username.trim()) newErrors.username = "Username is required";
        if (!password) newErrors.password = "Password is required";
        if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (password && !passwordRegex.test(password)) {
            newErrors.password = "Must be 8+ chars with uppercase, lowercase, number";
        }

        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const data = await apiRegister(username, password);

            if (data.token) {
                login({ id: data.id, username: data.username }, data.token);
                navigate('/dashboard');
            } else {
                setErrors({ form: data.message || "Registration failed" });
            }
        } catch (err) {
            setErrors({ form: "Network error. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {errors.form && <div className="alert alert-danger animation-slide-up">{errors.form}</div>}

            {/* USERNAME */}
            <div className="form-group-floating">
                <input
                    type="text"
                    className={`form-control-floating ${errors.username ? 'error' : ''}`}
                    placeholder=" "
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) setErrors({ ...errors, username: '' });
                    }}
                />
                <label className="label-floating">Username</label>
                {errors.username && <div className="form-error">{errors.username}</div>}
            </div>

            {/* PASSWORD */}
            <div className="form-group-floating">
                <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control-floating ${errors.password ? 'error' : ''}`}
                    placeholder=" "
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                />
                <label className="label-floating">Password</label>
                {errors.password && <div className="form-error">{errors.password}</div>}

                <span className="form-toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                </span>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group-floating">
                <input
                    type={showConfirm ? "text" : "password"}
                    className={`form-control-floating ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder=" "
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                />
                <label className="label-floating">Confirm Password</label>
                {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}

                <span className="form-toggle-password" onClick={() => setShowConfirm(!showConfirm)}>
                    <i className={showConfirm ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                </span>
            </div>

            <button type="submit" className="btn-success-gradient w-100 py-3 mt-4 btn-glow" disabled={loading}>
                <i className="bi bi-person-plus-fill me-2"></i>
                {loading ? 'Creating account...' : 'Register'}
            </button>
        </form>
    );
}