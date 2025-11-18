// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('RegisterPage: Register button clicked. Username:', username, 'Email:', email);

    if (!username || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
    // Basic client-side email format validation (Firebase will do more robust checks)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    // Firebase requires password to be at least 6 characters
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    const success = await register(username, email, password);
    console.log('RegisterPage: Register function returned success:', success);

    if (success) {
      // After successful registration and email verification email sent,
      // redirect to login and prompt user to check email.
      navigate('/login');
      toast.success('Registration successful! Please log in and check your email for verification.');
      console.log('RegisterPage: Navigating to login page after successful registration.');
    }
  };

  return (
    <div className="h-full bg-zinc-900 text-white flex items-center justify-center p-4">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-700">
        <h2 className="text-4xl font-extrabold text-blue-400 mb-8 text-center">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-zinc-300 text-lg font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-zinc-300 text-lg font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-zinc-300 text-lg font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md text-xl font-bold
                       hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>

        <p className="text-center text-zinc-400 mt-6 text-lg">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;