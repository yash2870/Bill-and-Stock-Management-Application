import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'; // Back arrow icon
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Eye icons for password toggle
import Navbar from './Navbar';
import Footer from './Footer';

//toast.configure(); // Initialize toast notifications

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://bill-and-stock-management-application.onrender.com/api/auth/login', {
                email,
                password,
            });

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success('Login successful!'); // Success toast
            setTimeout(() => navigate('/home', { state: { token, user } }), 100);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid email or password'); // Error toast
            setError(err.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar />
        <div className="flex justify-center items-center h-screen bg-gray-100 relative mt-4">
            {/* Back Arrow Icon */}
            {/* <button
                onClick={() => navigate('/')}
                className="absolute top-5 left-5 text-gray-500 hover:text-gray-700"
            >
                <FiArrowLeft size={24} />
            </button> */}

            <div className="bg-white shadow-lg p-8 rounded-lg w-full sm:w-96 md:w-96 lg:w-96 xl:w-96">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Login</h2>
                {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">
                            Email address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            onFocus={() => setError('')} // Clear error on focus
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="password" className="block text-gray-700 mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'} // Toggle input type
                            id="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            onFocus={() => setError('')} // Clear error on focus
                        />
                        {/* Eye Icon */}
                        <button
                            type="button"
                            className="absolute right-2 bottom-1 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>

                {/* Link to Signup Page */}
                <div className="mt-4 text-center">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link to="/signup" className="text-blue-600 hover:text-blue-700">
                        Signup
                    </Link>
                </div>
                {/* Forgot Password Link */}
                <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700">
                            Forgot Password?
                        </Link>
                    </div>
            </div>
        </div>
        <Footer />
        </div>
    );
};

export default Login;
