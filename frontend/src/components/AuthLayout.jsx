import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, icon }) => {
    return (
        <div className="auth-container animation-slide-up">
            <div className="auth-card shadow-elevated">
                <div className="auth-header">
                    <h2 className="typography-heading">
                        <i className={`bi bi-${icon}`}></i>
                        {title}
                    </h2>
                </div>
                <div className="auth-body">
                    {children}
                </div>
                <div className="auth-footer typography-body">
                    {title === 'Login' ? (
                        <p className="mb-0">
                            Don't have an account? <Link to="/register" className="text-gradient-primary fw-bold">Register here</Link>
                        </p>
                    ) : (
                        <p className="mb-0">
                            Already have an account? <Link to="/login" className="text-gradient-primary fw-bold">Login here</Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;