import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";

const ArtisanRegister = () => {
  const { navigate, axios, toast,isSeller, setIsSeller } = useAppContext();
  const [isLogin, setIsLogin] = useState(false);

  // Registration form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const artisanData = {
      name,
      email,
      phone,
      password,
      aadhaarId: id, // Changed to match backend field name
      street,
      city,
      state,
      country,
      zipCode,
    };

    console.log("Submitting Artisan:", artisanData);

    try {
      const { data } = await axios.post("/api/artisan/register", artisanData, {
        withCredentials: true,
      });

      if (data.success) {
        console.log("Registration Successful:", data);
        toast.success("Registration successful! Please log in.");
        setIsLogin(true); 
      } else {
        console.error("Registration failed:", data.error);
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error.response?.data);

      
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "/api/artisan/login",
        { email: loginEmail, password: loginPassword },
        { withCredentials: true }
      );

      if (data.success) { 
        console.log("Login Successful:", data);
        toast.success("Login successful!");
        setIsSeller(data.artisan);
      } else {
        console.error("Login failed:", data.error);
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-amber-50 flex justify-center items-center py-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full p-6 md:p-8 bg-white rounded-2xl border-2 border-amber-900 shadow-xl"
      >
        <h2 className="text-3xl font-bold text-amber-900 text-center mb-6">
          {isLogin ? "Artisan Login" : "Artisan Registration"}
        </h2>
        
        <p className="text-gray-600 text-center mb-8">
          {isLogin 
            ? "Welcome back! Log in to manage your artisan shop and products."
            : "Join our community of skilled artisans and showcase your handcrafted products to customers worldwide."}
        </p>
        
        {isLogin ? (
          // Login Form
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="bg-amber-50/50 p-4 rounded-xl">
              <div className="space-y-4">
                <div>
                  <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    id="loginEmail"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    id="loginPassword"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="mt-4 w-full px-4 py-2 text-white bg-amber-900 rounded-full hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors"
            >
              Login
            </button>
          </form>
        ) : (
          // Registration Form
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-amber-50/50 p-4 rounded-xl">
              <h3 className="text-xl font-semibold text-amber-900 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Card Number *</label>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      required
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                      placeholder="XXXX XXXX XXXX"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Address Information */}
            <div className="bg-amber-50/50 p-4 rounded-xl">
              <h3 className="text-xl font-semibold text-amber-900 mb-4">Address Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                    placeholder="123 Main Street"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                    placeholder="Mumbai"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                    placeholder="Maharashtra"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                    placeholder="India"
                  />
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                    placeholder="400001"
                  />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="mt-4 w-full px-4 py-2 text-white bg-amber-900 rounded-full hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors"
            >
              Register
            </button>
          </form>
        )}

        {/* Toggle between login and register */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-amber-900 hover:text-amber-700 underline focus:outline-none"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ArtisanRegister;