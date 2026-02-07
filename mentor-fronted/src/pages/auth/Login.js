import React, { useState } from "react";
import { FaGoogle, FaGithub, FaDiscord } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../../store/userSlice";
import Button from "../../components/Btncomponent";
import loginImg from "../../assets/login_illustration.png";
import authService from "../../services/authService";

function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleTabChange = (tab) => {
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
    setActiveTab(tab);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const response = await authService.login(email, password);

        if (response.success) {
          dispatch(addUser(response.data));
          navigate("/");
        }
      } else {
        const response = await authService.register(name, email, password);

        if (response.success) {
          dispatch(addUser(response.data));
          navigate("/");
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "shadow-sm appearance-none border border-neutral-200 dark:border-neutral-700 rounded-xl w-full py-3 px-4 text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all mb-4";
  const labelClasses = "block text-neutral-600 dark:text-neutral-400 text-sm font-bold mb-2";

  return (
    <div className="min-h-screen pb-20 pt-4 px-4 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-neutral-100 dark:border-neutral-800">

        {/* Left Side - Image/Illustration - Hidden on mobile */}
        <div className="hidden md:flex md:w-1/2 bg-primary-50 dark:bg-neutral-800 items-center justify-center p-8 lg:p-12">
          <div className="text-center">
            <img
              src={loginImg}
              alt="Login Illustration"
              className="w-full max-w-sm lg:max-w-md mx-auto mb-6 transform -rotate-2 hover:rotate-0 transition-all duration-500"
            />
            <h2 className="text-2xl lg:text-3xl font-bold text-primary-900 dark:text-white mb-4">
              {activeTab === 'login' ? 'Welcome Back!' : 'Join Our Community'}
            </h2>
            <p className="text-primary-700 dark:text-neutral-300">
              {activeTab === 'login'
                ? 'Sign in to continue your mentorship journey.'
                : 'Create an account to find the perfect mentor.'}
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 bg-white dark:bg-neutral-900">
          <div className="flex gap-4 mb-8 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${activeTab === 'login'
                ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-white shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
            >
              Login
            </button>
            <button
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${activeTab === 'signup'
                ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-white shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'signup' && (
              <div>
                <label className={labelClasses} htmlFor="name">Full Name</label>
                <input
                  className={inputClasses}
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className={labelClasses} htmlFor="email">Email Address</label>
              <input
                className={inputClasses}
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={labelClasses} htmlFor="password">Password</label>
              <input
                className={inputClasses}
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 mb-6"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (activeTab === 'login' ? 'Sign In' : 'Create Account')}
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">Or continue with</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button type="button" className="p-3 rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-600 transition-colors">
                <FaGoogle size={20} />
              </button>
              <button type="button" className="p-3 rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-600 transition-colors">
                <FaGithub size={20} />
              </button>
              <button type="button" className="p-3 rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-600 transition-colors">
                <FaDiscord size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
