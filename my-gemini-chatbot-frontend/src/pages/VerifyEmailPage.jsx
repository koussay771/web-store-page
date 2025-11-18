// src/pages/VerifyEmailPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getAuth, sendEmailVerification } from 'firebase/auth'; // Import sendEmailVerification
import toast from 'react-hot-toast';

const VerifyEmailPage = () => {
    const { user } = useAuth();
    const auth = getAuth(); // Get the Firebase Auth instance

    const handleResendVerification = async () => {
        // Ensure there's a logged-in Firebase user before trying to resend
        if (user && auth.currentUser) {
            try {
                await sendEmailVerification(auth.currentUser);
                toast.success('Verification email resent! Check your inbox.');
                console.log('VerifyEmailPage: Verification email resent to', auth.currentUser.email);
            } catch (error) {
                console.error('VerifyEmailPage: Error resending verification email:', error.code, error.message);
                toast.error('Failed to resend verification email.');
            }
        } else {
            toast.error('Please log in to resend verification email.');
        }
    };

    // If no user is logged in, redirect them or show a message
    if (!user) {
        return (
            <div className="h-full bg-zinc-900 text-white flex items-center justify-center p-4">
                <div className="bg-zinc-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-700 text-center">
                    <p className="text-zinc-300">You must be logged in to view this page.</p>
                    <button
                        onClick={() => window.location.href = '/login'} // Simple redirect
                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md text-lg font-medium
                                   hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-zinc-900 text-white flex items-center justify-center p-4">
            <div className="bg-zinc-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-700 text-center">
                <h2 className="text-3xl font-bold text-blue-400 mb-4">Verify Your Email</h2>
                <p className="text-zinc-300 mb-4">
                    A verification email has been sent to **{user.email}**. Please click the link in the email to activate your account.
                </p>
                <p className="text-zinc-400 text-sm mb-6">
                    If you don't see it, check your spam folder.
                </p>
                <button
                    onClick={handleResendVerification}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md text-lg font-medium
                               hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Resend Verification Email
                </button>
                <p className="text-zinc-400 mt-4 text-sm">
                    After verifying, you might need to log in again to refresh your session or simply refresh this page.
                </p>
            </div>
        </div>
    );
};

export default VerifyEmailPage;