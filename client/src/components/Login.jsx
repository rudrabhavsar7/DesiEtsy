import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { motion } from 'framer-motion'

const Login = () => {
  const { setUser, setShowUserLogin,user,BACKEND_URL,axios,toast,fetchUser } = useAppContext()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
      try {
        if (isSignUp) {
          const { data } = await axios.post(`${BACKEND_URL}/api/user/register`, {
            name,
            email,
            password,
          });

          if (data.success) {
            fetchUser();
            toast.success("Account Created Successfully");
          }

          console.log(data);
        } else {
          const { data } = await axios.post(`${BACKEND_URL}/api/user/login`, {
            email,
            password,
          });

          if (data.success) {
            fetchUser();
            toast.success("Logged In Successfully");
          }

          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
  }
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setShowUserLogin(false)}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-2xl border-2 border-amber-900 p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-custom text-amber-900">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <button 
            onClick={() => setShowUserLogin(false)}
            className="text-gray-500 hover:text-amber-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {isSignUp && (
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input 
                type="text" 
                onChange={(e) => setName(e.target.value)} 
                id="name" 
                name="name" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                placeholder="Your Name"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              type="email" 
              id="email" 
              name="email" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
              placeholder="your@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              type="password" 
              id="password" 
              name="password" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-amber-900 focus:ring-amber-900 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-amber-900 hover:text-amber-800">
                Forgot password?
              </a>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 bg-amber-900 text-white rounded-full hover:bg-amber-800 transition-colors font-medium"
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="ml-1 font-medium text-amber-900 hover:text-amber-800"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => {
                try {
                  window.location.href = `${BACKEND_URL}/api/user/oauth/google`;
                } catch (error) {
                  console.error("Google OAuth error:", error);
                  toast.error("Failed to connect with Google. Please try again.");
                  
                }
              }}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Login