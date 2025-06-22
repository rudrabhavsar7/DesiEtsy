import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import OverviewTab from '../../components/Artisan/OverviewTab';
import ProductsTab from '../../components/Artisan/ProductsTab';
import OrdersTab from '../../components/Artisan/OrdersTab';
import AddProductModal from '../../components/Artisan/AddProductModal';
import EditProductModal from '../../components/Artisan/EditProductModal';

const ArtisanDashboard = () => {
  const { products, currency, categories, subcategories, isSeller, setIsSeller, axios, navigate } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Simulate different product statuses for demo
  const allArtisanProducts = products.filter(product => product.artisanId === isSeller._id);
  
  // Filter products by status
  const pendingProducts = allArtisanProducts.filter(product => product.status === 'pending');
  const approvedProducts = allArtisanProducts.filter(product => product.status === 'approved');
  const rejectedProducts = allArtisanProducts.filter(product => product.status === 'rejected');
  
  const handleLogout = async () => {
    try {
      const {data} = await axios.post('/api/artisan/logout');
      if(data.success){
        setIsSeller(null);
        navigate('/');
        toast.success("Logged Out");
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditProductModal(true);
  };
  
  const handleProductUpdate = (updatedProduct) => {

    const updatedProducts = products.map(p => 
      p._id === updatedProduct._id ? updatedProduct : p
    );
    
    setShowEditProductModal(false);
    setSelectedProduct(null);
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return <OverviewTab 
          products={allArtisanProducts} 
          pendingCount={pendingProducts.length}
          approvedCount={approvedProducts.length}
          rejectedCount={rejectedProducts.length}
          currency={currency} 
        />;
      case 'products':
        return <ProductsTab 
          products={allArtisanProducts} 
          currency={currency} 
          title="All Products"
          emptyMessage="No products available. Add your first product!"
          onAddProduct={() => setShowAddProductModal(true)}
          onEditProduct={handleEditProduct}
        />;
      case 'pending':
        return <ProductsTab 
          products={pendingProducts} 
          currency={currency} 
          onAddProduct={() => setShowAddProductModal(true)}
          title="Pending Products"
          emptyMessage="No pending products to review."
          onEditProduct={handleEditProduct}
        />;
      case 'approved':
        return <ProductsTab 
          products={approvedProducts} 
          currency={currency} 
          onAddProduct={() => setShowAddProductModal(true)}
          title="Approved Products"
          emptyMessage="No approved products yet."
          onEditProduct={handleEditProduct}
        />;
      case 'rejected':
        return <ProductsTab 
          products={rejectedProducts} 
          currency={currency} 
          onAddProduct={() => setShowAddProductModal(true)}
          title="Rejected Products"
          showRejectionReason={true}
          emptyMessage="No rejected products."
          onEditProduct={handleEditProduct}
        />;
      case 'orders':
        return <OrdersTab currency={currency} />;
      default:
        return <OverviewTab 
          products={allArtisanProducts} 
          pendingCount={pendingProducts.length}
          approvedCount={approvedProducts.length}
          rejectedCount={rejectedProducts.length}
          currency={currency} 
        />;
    }
  };

  if(!isSeller.isVerified){
     return (
      <div className="flex flex-col justify-center items-center h-screen">
       <motion.h1
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.5 }}
         className="text-center text-3xl font-bold text-amber-900 mb-6"
       >
        Your Registration is not yet verified.<br/>
        Please Wait Till Verification
       </motion.h1>
      <button onClick={handleLogout} className='p-3 bg-amber-900 text-white rounded-full'>
        Logout
      </button>
       </div>
     );
  }
  
  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900">Artisan Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex overflow-x-auto mb-6 bg-white rounded-lg p-1 shadow-sm">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-md ${activeTab === 'overview' ? 'bg-amber-900 text-white' : 'text-gray-700 hover:bg-amber-100'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-md ${activeTab === 'products' ? 'bg-amber-900 text-white' : 'text-gray-700 hover:bg-amber-100'}`}
        >
          All Products
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-md ${activeTab === 'pending' ? 'bg-amber-900 text-white' : 'text-gray-700 hover:bg-amber-100'}`}
        >
          <span className="flex items-center">
            Pending
            {pendingProducts.length > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {pendingProducts.length}
              </span>
            )}
          </span>
        </button>
        <button 
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-md ${activeTab === 'approved' ? 'bg-amber-900 text-white' : 'text-gray-700 hover:bg-amber-100'}`}
        >
          <span className="flex items-center">
            Approved
            {approvedProducts.length > 0 && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {approvedProducts.length}
              </span>
            )}
          </span>
        </button>
        <button 
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 rounded-md ${activeTab === 'rejected' ? 'bg-amber-900 text-white' : 'text-gray-700 hover:bg-amber-100'}`}
        >
          <span className="flex items-center">
            Rejected
            {rejectedProducts.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {rejectedProducts.length}
              </span>
            )}
          </span>
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-md ${activeTab === 'orders' ? 'bg-amber-900 text-white' : 'text-gray-700 hover:bg-amber-100'}`}
        >
          Orders
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        {renderTabContent()}
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <AddProductModal 
          categories={categories}
          subcategories={subcategories}
          onClose={() => setShowAddProductModal(false)}
        />
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && selectedProduct && (
        <EditProductModal 
          product={selectedProduct}
          categories={categories} 
          subcategories={subcategories} 
          onClose={() => {
            setShowEditProductModal(false);
            setSelectedProduct(null);
          }} 
          onUpdate={handleProductUpdate}
        />
      )}
    </div>
  );
};

export default ArtisanDashboard;