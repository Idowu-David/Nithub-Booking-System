import React from "react";
// Assuming you have installed and configured React Router (react-router-dom)
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Welcome to <span className="text-indigo-600">NitHub</span>
        </h1>
        <p className="text-xl text-gray-600">
          What would you like to do today?
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
          <Link
            to="/login" // This is the correct target route for the login page
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md w-full sm:w-auto text-center"
          >
            Login
          </Link>
          <Link
            to="/signup" // This is the correct target route for the sign up page
            className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-md w-full sm:w-auto text-center"
          >
            Sign Up
          </Link>
        </div>

        <div className="pt-8 border-t border-gray-300 mt-12">
          <p className="text-sm text-gray-500 mb-4">Quick Access</p>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link
              to="/dashboards/user"
              className="px-6 py-2 text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
            >
              Go to User Dashboard →
            </Link>
            <Link
              to="/dashboards/admin"
              className="px-6 py-2 text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
            >
              Go to Admin Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
