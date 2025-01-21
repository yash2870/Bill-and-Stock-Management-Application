import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
const LandingPage = () => {
    return (
        
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar />
            
            <div className="container mx-auto px-6 mt-5">
          
            <header className="text-center my-5">
                <h1 className="text-4xl font-bold text-gray-800">Welcome to Bill Sahayak</h1>
                <p className="text-lg text-gray-600 mt-3">
                    Your all-in-one solution for easy and efficient billing and stock management.
                </p>
            </header>

            <div className="flex flex-col md:flex-row mt-5">
                {/* Image Section */}

                <div className="md:w-1/2 flex justify-center mb-5 md:mb-0 md:pl-16">
                    <img
                        src="logo.jpeg"
                        alt="Billing Software"
                        className="max-w-full max-h-96 rounded-lg shadow-lg" // max-h-64 increases the height
                    />
                </div>


                {/* Text Section */}
                <div className="md:w-1/2 md:pl-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
                    <ul className="list-disc list-inside text-lg text-gray-600">
                        <li>✅ Easy to use interface</li>
                        <li>✅ Quick and accurate billing</li>
                        <li>✅ Automatic GST calculations</li>
                        <li>✅ Print-ready invoices</li>
                        <li>✅ Manage Your Stocks</li>
                        <li>✅ Auto-update of the Stocks</li>
                    </ul>

                    {/* Login and Sign Up Buttons side by side */}
                    <div className="mt-6 flex space-x-4">
                        <Link
                            to="/login"
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg w-full md:w-auto text-lg text-center">
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg w-full md:w-auto text-lg text-center">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>

            {/* <footer className="text-center my-5">
                <p className="text-gray-500">© 2025 BillingSahayak. All rights reserved.</p>
            </footer> */}
            
        </div>
        <Footer />   
        </div>
    );
};

export default LandingPage;
