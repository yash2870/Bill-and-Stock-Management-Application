import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import Footer from './Footer';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/forgotpassword/forgot-password', { email });

            // Check if response contains a success message
            if (response.data.message === 'If your email exists, you will receive a password reset link.') {
                toast.success('Password reset link sent.');
            }
        } catch (error) {
            // If the email does not exist or there was another error, show the message from the backend
            toast.error(error.response?.data?.message || 'Error sending reset email');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-md rounded-lg" >
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                    <h2 className="text-2xl font-semibold text-center mb-6">Enter Your Email</h2>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email:
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 bg-indigo-600 text-white rounded-lg mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Email'}
                        </button>
                    </form>
                </div>
            </div>
           
        </div>
    );
};
export default ForgotPassword;
