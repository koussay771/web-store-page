// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification, updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth as firebaseAuth } from '../firebaseConfig';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      console.log("AuthContext: onAuthStateChanged triggered."); // ADD THIS
      if (firebaseUser) {
        // User is signed in.
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          emailVerified: firebaseUser.emailVerified
        });
        // --- CRITICAL LOGS: What is firebaseUser telling us? ---
        console.log('AuthContext: Firebase user loaded:', firebaseUser.uid);
        console.log('AuthContext: Firebase user email:', firebaseUser.email);
        console.log('AuthContext: Firebase user emailVerified status:', firebaseUser.emailVerified);
        // --------------------------------------------------------
      } else {
        // User is signed out
        setUser(null);
        console.log('AuthContext: Firebase user signed out.');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const firebaseUser = userCredential.user;
      console.log('AuthContext: User signed in with Firebase:', firebaseUser.uid);
      // After login, Firebase user state will be picked up by onAuthStateChanged
      toast.success(`Welcome back, ${firebaseUser.displayName || firebaseUser.email}!`);
      return true;
    } catch (error) {
      console.error('AuthContext: Firebase Login error:', error.code, error.message);
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      }
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: username });
      console.log('AuthContext: User created with Firebase:', firebaseUser.uid, 'DisplayName set:', username);

      // --- CRITICAL LOG: Confirming sendEmailVerification call ---
      console.log('AuthContext: Attempting to send verification email...');
      await sendEmailVerification(firebaseUser); // This sends the email
      console.log('AuthContext: sendEmailVerification function completed.'); // ADD THIS
      toast('Verification email sent! Please check your inbox.', { icon: '📧' });
      console.log('AuthContext: Verification email sent to', firebaseUser.email);

      toast.success(`Account created! Welcome, ${username}! Please verify your email.`);
      return true;
    } catch (error) {
      console.error('AuthContext: Firebase Registration error:', error.code, error.message);
      let errorMessage = 'Registration failed.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak (must be at least 6 characters).';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      }
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      toast('Logged out successfully.', { icon: '👋' });
      console.log('AuthContext: User logged out via Firebase.');
    } catch (error) {
      console.error('AuthContext: Error logging out:', error.code, error.message);
      toast.error('Failed to log out.');
    }
  };

  const contextValue = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
  }), [user, loading, login, register, logout]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-zinc-900 text-white">Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};