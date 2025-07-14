import React from 'react';
import { auth, provider, signInWithPopup } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6">
      <img src="/logo.png" className='h-50 w-50'/>
      <p className="text-gray-400 mb-10 text-sm text-center">
        Your fast lane around campus 🚕
      </p>

      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-3 bg-white text-black px-5 py-3 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200"
      >
        <FcGoogle size={24} />
        <span className="text-sm font-medium">Sign in with Google</span>
      </button>

      <footer className="absolute bottom-4 text-xs text-gray-600">
        Made with ❤️ at NIT Trichy
      </footer>
    </div>
  );
};

export default Login;
