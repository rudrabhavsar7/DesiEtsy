import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Orders = () => {
  const { user,setShowUserLogin,orders,currency,navigate } = useAppContext();
  const [activeTab, setActiveTab] = useState('all');
  
  // Sample order data - replace with actual data from your context or API
  const sampleOrders = orders || [];

  // Filter orders based on active tab
  const filteredOrders = sampleOrders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  console.log("Filtered Orders:", filteredOrders);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-amber-100 text-amber-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-amber-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-custom text-amber-900 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Orders
          </motion.h1>
          <motion.p 
            className="text-amber-800/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Track and manage your purchases
          </motion.p>
        </div>

        {/* Order status tabs */}
        <motion.div 
          className="flex overflow-x-auto scrollbar-hide space-x-2 mb-6 pb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {['all', 'processing', 'shipped', 'delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-amber-900 text-white shadow-md' 
                  : 'bg-white text-amber-900 border border-amber-900/20 hover:bg-amber-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Orders list */}
        {user ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.div
                  key={order._id}
                  variants={itemVariants}
                  className="bg-white rounded-2xl border-2 border-amber-900/10 shadow-md overflow-hidden"
                >
                  {/* Order header */}
                  <div className="bg-amber-100/50 px-4 py-3 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-900/10">
                    <div>
                      <h3 className="text-lg font-medium text-amber-900">Order #{order._id}</h3>
                      <p className="text-sm text-amber-800/70">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center">
                      {getStatusBadge(order.status)}
                      <span className="ml-4 text-lg font-medium text-amber-900">
                        {currency}{order.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Order items */}
                  <div className="divide-y divide-amber-100">
                    {order.orderItems.map((item) => (

                      <div key={item._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="w-full sm:w-16 h-16 bg-amber-50 rounded-lg overflow-hidden flex-shrink-0 mb-4 sm:mb-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150?text=Product";
                            }}
                          />
                        </div>
                        <div className="sm:ml-6 flex-1">
                          <h4 className="text-base font-medium text-amber-900">{item.name}</h4>
                          <p className="mt-1 text-sm text-amber-800/70">
                            Qty: {item.quantity} × {currency}{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                          <button 
                            onClick={() => navigate(`/products/category/subcategory/${item.productId}`)} 
                            className="text-sm font-medium text-amber-700 hover:text-amber-900 hover:underline"
                          >
                            View Product
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order actions */}
                  <div className="bg-amber-50/50 px-4 py-3 sm:px-6 flex flex-wrap gap-3 justify-end">
                    <button className="px-4 py-2 bg-white border border-amber-900 text-amber-900 rounded-full hover:bg-amber-100 transition-colors text-sm">
                      Track Order
                    </button>
                    <button className="px-4 py-2 bg-amber-900 text-white rounded-full hover:bg-amber-800 transition-colors text-sm">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-2xl border-2 border-amber-900/10 p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-amber-900 mb-2">No {activeTab !== 'all' ? activeTab : ''} orders found</h3>
                <p className="text-amber-800/70 mb-6">
                  {activeTab !== 'all' 
                    ? `You don't have any ${activeTab} orders at the moment.` 
                    : "You haven't placed any orders yet."}
                </p>
                <Link 
                  to="/products" 
                  className="inline-block px-6 py-3 bg-amber-900 text-white rounded-full hover:bg-amber-800 transition-colors"
                >
                  Shop Now
                </Link>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="bg-white rounded-2xl border-2 border-amber-900/10 p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-amber-900 mb-2">Please log in to view your orders</h3>
            <p className="text-amber-800/70 mb-6">
              You need to be logged in to access your order history.
            </p>
            <button 
              onClick={() => setShowUserLogin(true)}  
              className="inline-block px-6 py-3 bg-amber-900 text-white rounded-full hover:bg-amber-800 transition-colors"
            >
              Log In
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Orders