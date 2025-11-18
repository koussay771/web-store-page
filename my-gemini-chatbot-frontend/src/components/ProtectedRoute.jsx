// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // --- CRITICAL LOGS: What ProtectedRoute sees ---
    console.log('ProtectedRoute: Received User:', user);
    console.log('ProtectedRoute: Received Loading State:', loading);
    // -----------------------------------------------

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-zinc-900 text-white">Loading authentication...</div>;
    }

    if (!user) {
        toast.error('You need to log in to access this page.');
        return <Navigate to="/login" replace />;
    }

    // --- Check if email is verified ---
    if (user && !user.emailVerified) { // This condition is key!
        toast.error('Please verify your email to access this page. Check your inbox!');
        return <Navigate to="/verify-email" replace />;
    }

    // User is logged in AND email is verified, render the children
    console.log('ProtectedRoute: User is logged in and email verified, rendering children.');
    return children;
};

export default ProtectedRoute;