import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ArtisanDashboard = () => {
  const { products, currency, categories, subcategories,isSeller,setIsSeller,axios,navigate } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  
  const artisanProducts = products.slice(0, 5); // Just showing first 5 for demo
  
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
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return <OverviewTab products={artisanProducts} currency={currency} />;
      case 'products':
        return <ProductsTab 
          products={artisanProducts} 
          currency={currency} 
          onAddProduct={() => setShowAddProductModal(true)}
        />;
      case 'orders':
        return <OrdersTab currency={currency} />;
      default:
        return <OverviewTab products={artisanProducts} currency={currency} />;
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
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Artisan Dashboard</h1>
      
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
          Products
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
    </div>
  );
};

// Tab Components
const OverviewTab = ({ products, currency }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-amber-100 p-4 rounded-lg">
        <h3 className="text-sm text-gray-600">Total Products</h3>
        <p className="text-2xl font-bold">{products.length}</p>
      </div>
      <div className="bg-green-100 p-4 rounded-lg">
        <h3 className="text-sm text-gray-600">Total Sales</h3>
        <p className="text-2xl font-bold">{currency}12,500</p>
      </div>
      <div className="bg-blue-100 p-4 rounded-lg">
        <h3 className="text-sm text-gray-600">Total Orders</h3>
        <p className="text-2xl font-bold">24</p>
      </div>
    </div>
    
    <h3 className="text-lg font-semibold mb-2">Recent Products</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">Product</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id} className="border-t">
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">{currency}{product.offerPrice}</td>
              <td className="px-4 py-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ProductsTab = ({ products, currency, onAddProduct }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Your Products</h2>
      <button 
        onClick={onAddProduct}
        className="bg-amber-900 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition-colors"
      >
        Add New Product
      </button>
    </div>
    
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">Product</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id} className="border-t">
              <td className="px-4 py-2 flex items-center">
                <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded mr-2" />
                {product.name}
              </td>
              <td className="px-4 py-2">{currency}{product.offerPrice}</td>
              <td className="px-4 py-2">{product.category}</td>
              <td className="px-4 py-2">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                <button className="text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const OrdersTab = ({ currency }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
    
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id: 'ORD-001', customer: 'Priya Sharma', amount: 1200, status: 'Delivered', date: '2023-10-15' },
            { id: 'ORD-002', customer: 'Rahul Verma', amount: 850, status: 'Processing', date: '2023-10-14' },
            { id: 'ORD-003', customer: 'Ananya Patel', amount: 2100, status: 'Shipped', date: '2023-10-12' }
          ].map(order => (
            <tr key={order.id} className="border-t">
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">{order.customer}</td>
              <td className="px-4 py-2">{currency}{order.amount}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-2">{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Add Product Modal Component
const AddProductModal = ({ categories, subcategories, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: [''],
    price: '',
    offerPrice: '',
    category: '',
    sizes: [],
    images: []
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    subcat => subcat.category === selectedCategory
  );
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (e) => {
    const categoryPath = e.target.value;
    setSelectedCategory(categoryPath);
    // Reset subcategory when category changes
    setFormData(prev => ({ ...prev, category: '' }));
  };
  
  const handleDescriptionChange = (index, value) => {
    const newDescription = [...formData.description];
    newDescription[index] = value;
    setFormData(prev => ({ ...prev, description: newDescription }));
  };
  
  const addDescriptionField = () => {
    setFormData(prev => ({ 
      ...prev, 
      description: [...prev.description, ''] 
    }));
  };
  
  const removeDescriptionField = (index) => {
    if (formData.description.length > 1) {
      const newDescription = [...formData.description];
      newDescription.splice(index, 1);
      setFormData(prev => ({ ...prev, description: newDescription }));
    } else {
      toast.error("At least one description field is required");
    }
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (formData.images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };
  
  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Product added successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to add product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-amber-900">Add New Product</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
                placeholder="Enter product name"
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                <input 
                  type="number" 
                  id="price" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
                  placeholder="Original price"
                  min="0"
                  step="0.01"
                  required 
                />
              </div>
              <div>
                <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700 mb-1">Offer Price*</label>
                <input 
                  type="number" 
                  id="offerPrice" 
                  name="offerPrice" 
                  value={formData.offerPrice} 
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
                  placeholder="Discounted price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
              <select 
                id="category" 
                name="category" 
                value={selectedCategory} 
                onChange={handleCategoryChange} 
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
                required 
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.path} value={cat.path}>{cat.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">Subcategory*</label>
              <select 
                id="subcategory" 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
                disabled={!selectedCategory}
                required 
              >
                <option value="">Select a subcategory</option>
                {filteredSubcategories.map(subcat => (
                  <option key={subcat.path} value={subcat.title}>{subcat.title}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Product Description*</label>
              <button 
                type="button" 
                onClick={addDescriptionField} 
                className="text-xs text-amber-900 hover:text-amber-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Point
              </button>
            </div>
            
            {formData.description.map((desc, index) => (
              <div key={index} className="flex items-center mb-2">
                <textarea 
                  rows="2" 
                  value={desc} 
                  onChange={(e) => handleDescriptionChange(index, e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
                  placeholder={`Description point ${index + 1}`}
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => removeDescriptionField(index)} 
                  className="ml-2 text-red-500 hover:text-red-700"
                  disabled={formData.description.length <= 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images* (Max 5)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 7H19a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2.091A5.972 5.972 0 0110 16zm0 1a2 2 0 100-4 2 2 0 000 4zm9-1a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Drag &amp; drop files here, or click to select files</p>
              </div>
            </div>
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={URL.createObjectURL(img)} alt={`Uploaded ${index}`} className="w-full h-24 object-cover rounded" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)} 
                      className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-amber-900 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ArtisanDashboard;