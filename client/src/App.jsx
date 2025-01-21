import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import GenerateBill from './components/GenerateBill';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { ToastContainer } from 'react-toastify';

const App = () => {
    const [authData, setAuthData] = React.useState(null); // To store token and user data

    return (
        <Router>
            {/* Global Toast Notifications Container */}
            <ToastContainer
                    position="top-center"  // Centering the toast at the top
                    autoClose={3000}       // Adjust auto-close time (optional)
                    hideProgressBar={true} // Show progress bar (optional)
                    newestOnTop={false}    // Position newer toasts on top
                    closeOnClick
                    rtl={false}
                    // pauseOnFocusLoss
                    // draggable
                    // pauseOnHover
                />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route 
                    path="/login" 
                    element={<LoginPage  />} 
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                <Route 
                    path="/home" 
                    element={
                         <HomePage  /> 
                    } 
                />
                <Route path="/bill" element={<GenerateBill />} />
            </Routes>
        </Router>
    );
};

export default App;
