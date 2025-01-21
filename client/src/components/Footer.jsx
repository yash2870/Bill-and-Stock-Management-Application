import React from 'react';

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white py-6 mt-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        {/* Profile Information */}
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <img
            src="My photo.jpg" // Replace with your actual image path
            alt="Your Name"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-lg">Developed by Yash Mukhopadhyay</h3>
            <div className="flex space-x-4 mt-2">
              <a
                href="https://www.linkedin.com/in/yash-mukhopadhyay-286183225"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/yash2870"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div>
          <p className="text-sm text-gray-400">© 2025 Billing Sahayak. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
