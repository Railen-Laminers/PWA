import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!username.trim()) newErrors.username = "Username is required";
        if (!password.trim()) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const data = await apiLogin(username, password);
            if (data.token) {
                login({ id: data.id, username: data.username }, data.token);
                navigate('/dashboard');
            } else {
                setErrors({ form: data.message || 'Login failed' });
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

                <span
                    className="form-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                </span>
            </div>

            <button type="submit" className="btn-primary-gradient w-100 py-3 mt-4 btn-glow" disabled={loading}>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                {loading ? 'Signing in...' : 'Login'}
            </button>
        </form>
    );
}