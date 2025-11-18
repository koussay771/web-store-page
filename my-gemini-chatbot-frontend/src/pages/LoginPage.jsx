// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('LoginPage: Login button clicked. Email:', email);

    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    const success = await login(email, password);
    console.log('LoginPage: Login function returned success:', success);

    if (success) {
      navigate('/cart'); // Navigate to /cart after successful login
      console.log('LoginPage: Navigating to /cart after successful login.');
    }
  };

  return (
    <div className="h-full bg-zinc-900 text-white flex items-center justify-center p-4">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-700">
        <h2 className="text-4xl font-extrabold text-blue-400 mb-8 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            Login
          </button>
        </form>

        <p className="text-center text-zinc-400 mt-6 text-lg">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;