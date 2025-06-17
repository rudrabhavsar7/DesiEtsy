import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const ArtisanDashboard = () => {
  const { user } = useAppContext();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const menuItems = [
    { name: 'Overview', path: '/artisan/dashboard', icon: 'chart-pie' },
    { name: 'Products', path: '/artisan/products', icon: 'shopping-bag' },
    { name: 'Orders', path: '/artisan/orders', icon: 'shopping-cart' },
    { name: 'Reviews', path: '/artisan/reviews', icon: 'star' },
    { name: 'Settings', path: '/artisan/settings', icon: 'cog' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-amber-900/20 p-4 flex justify-between items-center">
        <h1 className="font-custom text-amber-900 text-xl">Artisan Dashboard</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full bg-amber-100 text-amber-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <motion.div 
        className={`bg-white border-r border-amber-900/20 w-full md:w-64 md:min-h-screen md:flex flex-col ${isMobileMenuOpen ? 'flex' : 'hidden'}`}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Profile Section */}
        <div className="p-4 border-b border-amber-900/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-900 font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{user?.name || 'Artisan'}</h3>
              <p className="text-xs text-gray-500">{user?.email || 'artisan@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-amber-900 text-white'
                      : 'text-gray-700 hover:bg-amber-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-amber-900/20">
          <button className="w-full p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default ArtisanDashboard;