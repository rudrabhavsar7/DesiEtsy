import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";

const AdminLogin = () => {
  const { axios, toast, navigate, setIsAdmin, isAdmin } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "/api/admin/login",
        { email, password },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Login successful!");
        setIsAdmin(true);
        navigate("/admin/dashboard");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-amber-50 flex justify-center items-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full p-6 md:p-8 bg-white rounded-2xl border-2 border-amber-900 shadow-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-amber-900">Admin Login</h2>
          <p className="text-gray-600 mt-2">
            Access the admin dashboard to manage products, artisans, and more.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-amber-900 rounded-full hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <div className="text-sm text-gray-500">
              <span>Need help? Contact </span>
              <a
                href="mailto:support@desietsy.com"
                className="text-amber-900 hover:underline"
              >
                support@desietsy.com
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
