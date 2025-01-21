
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate for redirection
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Navbar from './Navbar';
// import Footer from './Footer';
const ResetPassword = () => {
    const { token } = useParams(); // Get the token from the URL
    const [newPassword, setNewPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate(); // useNavigate for redirection

    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // // Function to validate the password before submitting
    // const validatePassword = (password) => {
    //     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //     if (!passwordRegex.test(password)) {
    //         setPasswordError('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character.');
    //     } else {
    //         setPasswordError('');
    //     }
    // };
    // Function to validate the password before submitting
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            toast.error('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character.');
            return false;
        }
        return true;
    };

    // Handle the password reset form submission
    const handleResetPassword = async (e) => {
        e.preventDefault();
        validatePassword(newPassword); // Check password validity
        if (passwordError) {
            return;
        }

        try {
            // Send the request to reset the password
            await axios.post(`http://localhost:8000/api/resetpassword/reset-password/${token}`, {
                password: newPassword, // Corrected key for backend
            });
            toast.success('Password reset successful!');

            // Redirect to login page after 1 second
            setTimeout(() => {
                navigate('/login'); // Assuming '/login' is the login page route
            }, 1000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error resetting password');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-md rounded-lg">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
                <form onSubmit={handleResetPassword}>
                    <div className="mb-4 relative">
                        <label htmlFor="password" className="block text-gray-700 mb-2">
                            New Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type={passwordVisible ? 'text' : 'password'} // Toggle password visibility
                            id="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            onBlur={() => validatePassword(newPassword)} // Validate on blur
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-2 bottom-1 transform -translate-y-1/2 text-gray-500"
                        >
                            {passwordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>

                    {passwordError && (
                        <div className="text-red-500 text-sm mb-4">{passwordError}</div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default ResetPassword;
