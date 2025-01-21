import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi'; // Importing icons for the hamburger menu and close icon
import { Link } from 'react-router-dom'; // Import Link component

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to handle mobile menu toggle
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if the user is logged in
    const navigate = useNavigate(); // Hook to navigate to login page after logout

    // Check if the user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // If token exists, user is logged in
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');  // Clear user token
        localStorage.removeItem('user');   // Clear user data
        setIsLoggedIn(false); // Update logged-in state
        navigate('/');         // Redirect to login page
    };

    return (
        <nav className="bg-blue-600 text-white shadow-md w-full">
            <div className="max-w-full mx-auto flex items-center justify-between p-4">
                {/* Logo Section */}
                <Link
                    to={isLoggedIn ? '/home' : '/'}
                    className="text-2xl font-semibold cursor-pointer"
                >
                    Bill Sahayak
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-4">
                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        className="text-white text-2xl"
                    >
                        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden flex flex-col items-center mt-4 space-y-4">
                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition w-full text-center"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;

