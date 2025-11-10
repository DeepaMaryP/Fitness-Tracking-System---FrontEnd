import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-10 text-center max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Unauthorized Access</h2>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page. Please login with the correct account.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
        >
          Go to Login
        </Link>
      </div>     
    </div>
  );
};

export default Unauthorized;
