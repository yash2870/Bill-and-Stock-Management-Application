import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {  FiEye, FiEyeOff } from 'react-icons/fi'; // Importing eye icons
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importing the toast module
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import styles
import Navbar from './Navbar';
import Footer from './Footer';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
    const navigate = useNavigate();

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const businessNameRef = useRef(null);

    // Email validation regular expression
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Password validation regular expression (minimum 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    const handleSignup = async (e) => {
        e.preventDefault();

        // Clear previous error notifications
        toast.dismiss();

        // Check if email is valid
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            emailRef.current.focus();
            return;
        }

        // Check if password is valid
        if (!passwordRegex.test(password)) {
            toast.error(
                'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one digit, and one special character'
            );
            passwordRef.current.focus();
            return;
        }

        try {
            const response = await axios.post('https://bill-and-stock-management-application.onrender.com/api/auth/signup', {
                email,
                password,
                businessName,
            });

            // Success message using toast
            toast.success('Signup successful! ');
            setTimeout(() => navigate('/login'), 1000);
        } catch (err) {
            // Display error message using toast
            const errorMessage = err.response?.data?.message || 'Signup failed';

            // Show error message using toast
            toast.error(errorMessage);

            // Focus on the respective field if the error is related to that field
            if (errorMessage.includes('email')) {
                emailRef.current.focus();
            } else if (errorMessage.includes('password')) {
                passwordRef.current.focus();
            } else if (errorMessage.includes('business')) {
                businessNameRef.current.focus();
            }
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar />
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg p-8 rounded-lg w-full sm:w-96 md:w-96 lg:w-96 xl:w-96 mt-4">
                {/* Back Arrow Icon
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-5 left-5 text-gray-500 hover:text-gray-700"
                >
                    <FiArrowLeft size={24} />
                </button> */}
                
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Signup</h2>
                
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <label htmlFor="businessName" className="block text-gray-700 mb-2">
                            Business Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="businessName"
                            ref={businessNameRef} // Assign ref for focusing on error
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">
                            Email address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            ref={emailRef} // Assign ref for focusing on error
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="password" className="block text-gray-700 mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type={passwordVisible ? 'text' : 'password'} // Toggle password visibility
                            id="password"
                            ref={passwordRef} // Assign ref for focusing on error
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-2 bottom-1 transform -translate-y-1/2 text-gray-500"
                        >
                            {passwordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Signup
                    </button>
                </form>
                {/* Link to Login Page */}
                <div className="mt-4 text-center">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-700"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
        <Footer />
        </div>
    );
};

export default SignupPage;
