// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-primary">
            <div className="container">
                <Link className="navbar-brand navbar-brand-primary typography-heading" to="/">
                    <i className="bi bi-trophy-fill me-2"></i>
                    SportsTask
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav me-auto">
                        {/* {currentUser && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className="nav-link text-light typography-body btn-glow"
                                        to="/dashboard"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <i className="bi bi-speedometer2 me-1"></i>
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className="nav-link text-light typography-body btn-glow"
                                        to="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <i className="bi bi-person-circle me-1"></i>
                                        Profile
                                    </Link>
                                </li>
                            </>
                        )} */}
                    </ul>

                    <div className="d-flex align-items-center">
                        <ul className="navbar-nav align-items-center">
                            {currentUser ? (
                                <>
                                    {/* USER NAME BESIDE DROPDOWN */}
                                    <span className="text-light me-2 fw-semibold typography-body animation-pulse">
                                        {currentUser.username || currentUser.email}
                                    </span>

                                    {/* AVATAR DROPDOWN */}
                                    <li className="nav-item dropdown">
                                        <a
                                            className="nav-link dropdown-toggle d-flex align-items-center text-light"
                                            href="#"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <span className="badge-accent badge rounded-circle animation-pulse">
                                                {currentUser.username?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </a>

                                        {/* DROPDOWN MENU */}
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <Link
                                                    className="dropdown-item btn-glow"
                                                    to="/profile"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <i className="bi bi-person-circle me-2"></i>
                                                    Profile Settings
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item btn-glow"
                                                    to="/dashboard"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <i className="bi bi-columns-gap me-2"></i>
                                                    Dashboard
                                                </Link>
                                            </li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                                <button
                                                    className="dropdown-item text-danger btn-glow"
                                                    onClick={handleLogout}
                                                >
                                                    <i className="bi bi-box-arrow-right me-2"></i>
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link text-light typography-body btn-glow"
                                            to="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <i className="bi bi-box-arrow-in-right me-1"></i>
                                            Login
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link text-light typography-body btn-glow"
                                            to="/register"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <i className="bi bi-person-plus me-1"></i>
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;