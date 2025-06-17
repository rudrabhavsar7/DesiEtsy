import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const { products, currency, axios, BACKEND_URL, navigate, setIsAdmin } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(''); // 'product' or 'artisan'
  
  // Mock data for pending items
  const pendingProducts = products.slice(0, 3).map(product => ({
    ...product,
    status: 'pending',
    artisanName: 'Artisan ' + Math.floor(Math.random() * 10)
  }));
  
  const pendingArtisans = [
    { id: 'A001', name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 98765 43210', joinDate: '2023-10-15', status: 'pending' },
    { id: 'A002', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 87654 32109', joinDate: '2023-10-16', status: 'pending' },
    { id: 'A003', name: 'Amit Patel', email: 'amit@example.com', phone: '+91 76543 21098', joinDate: '2023-10-17', status: 'pending' },
  ];
  
  const openVerifyModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setShowVerifyModal(true);
  };
  
  const handleVerify = (approved) => {
    const message = approved 
      ? `${modalType === 'product' ? 'Product' : 'Artisan'} approved successfully!` 
      : `${modalType === 'product' ? 'Product' : 'Artisan'} rejected.`;
    
    toast.success(message);
    setShowVerifyModal(false);
    
    // In a real app, you would update the status in your database
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/admin/logout`, {}, { withCredentials: true });
      
      if (data.success) {
        setIsAdmin(false);
        toast.success('Logged out successfully');
        navigate('/admin');
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return <OverviewTab pendingProducts={pendingProducts} pendingArtisans={pendingArtisans} />;
      case 'products':
        return <ProductsTab pendingProducts={pendingProducts} onVerify={(product) => openVerifyModal(product, 'product')} />;
      case 'artisans':
        return <ArtisansTab pendingArtisans={pendingArtisans} onVerify={(artisan) => openVerifyModal(artisan, 'artisan')} />;
      default:
        return <OverviewTab pendingProducts={pendingProducts} pendingArtisans={pendingArtisans} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900">Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
          Products Verification
        </button>
        <button 
          onClick={() => setActiveTab('artisans')}
          className={`px-4 py-2 rounded-md ${activeTab === 'artisans' ? 'bg-amber-900 text-white' : 'text-gray-700 hover:bg-amber-100'}`}
        >
          Artisan Approval
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        {renderTabContent()}
      </div>

      {/* Verification Modal */}
      {showVerifyModal && selectedItem && (
        <VerificationModal 
          item={selectedItem}
          type={modalType}
          onClose={() => setShowVerifyModal(false)}
          onVerify={handleVerify}
        />
      )}
    </div>
  );
};

const OverviewTab = ({ pendingProducts, pendingArtisans }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-amber-100 p-4 rounded-lg">
        <h3 className="text-sm text-gray-600">Pending Products</h3>
        <p className="text-2xl font-bold">{pendingProducts.length}</p>
      </div>
      <div className="bg-green-100 p-4 rounded-lg">
        <h3 className="text-sm text-gray-600">Pending Artisans</h3>
        <p className="text-2xl font-bold">{pendingArtisans.length}</p>
      </div>
      <div className="bg-blue-100 p-4 rounded-lg">
        <h3 className="text-sm text-gray-600">Total Users</h3>
        <p className="text-2xl font-bold">124</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Product Submissions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Artisan</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingProducts.map(product => (
                <tr key={product._id} className="border-t">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.artisanName}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Artisan Applications</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Join Date</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingArtisans.map(artisan => (
                <tr key={artisan.id} className="border-t">
                  <td className="px-4 py-2">{artisan.name}</td>
                  <td className="px-4 py-2">{artisan.joinDate}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

const ProductsTab = ({ pendingProducts, onVerify }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Products Pending Verification</h2>
    
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">Product</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Artisan</th>
            <th className="px-4 py-2 text-left">Submission Date</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingProducts.map(product => (
            <tr key={product._id} className="border-t">
              <td className="px-4 py-2 flex items-center">
                <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded mr-2" />
                {product.name}
              </td>
              <td className="px-4 py-2">{product.category}</td>
              <td className="px-4 py-2">{product.artisanName}</td>
              <td className="px-4 py-2">2023-10-18</td>
              <td className="px-4 py-2">
                <button 
                  onClick={() => onVerify(product)}
                  className="bg-amber-900 text-white px-3 py-1 rounded hover:bg-amber-800 transition-colors"
                >
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ArtisansTab = ({ pendingArtisans, onVerify }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Artisans Pending Approval</h2>
    
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Join Date</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingArtisans.map(artisan => (
            <tr key={artisan.id} className="border-t">
              <td className="px-4 py-2">{artisan.name}</td>
              <td className="px-4 py-2">{artisan.email}</td>
              <td className="px-4 py-2">{artisan.phone}</td>
              <td className="px-4 py-2">{artisan.joinDate}</td>
              <td className="px-4 py-2">
                <button 
                  onClick={() => onVerify(artisan)}
                  className="bg-amber-900 text-white px-3 py-1 rounded hover:bg-amber-800 transition-colors"
                >
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const VerificationModal = ({ item, type, onClose, onVerify }) => {
  const [notes, setNotes] = useState('');
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-2xl border-2 border-amber-900 p-6 w-full max-w-3xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-custom text-amber-900">
            {type === 'product' ? 'Product Verification' : 'Artisan Approval'}
          </h1>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-amber-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          {type === 'product' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full h-64 object-contain border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {item.images.slice(0, 4).map((img, index) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`Thumbnail ${index}`} 
                      className="w-full h-16 object-cover border rounded"
                    />
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-gray-600 mb-2">Category: {item.category}</p>
                <p className="text-gray-600 mb-2">Artisan: {item.artisanName}</p>
                <p className="text-gray-600 mb-2">Price: ₹{item.offerPrice} <span className="line-through text-gray-400">₹{item.price}</span></p>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-1">Description:</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    {item.description.map((desc, index) => (
                      <li key={index}>{desc}</li>
                    ))}
                  </ul>
                </div>
                
                {item.sizes && item.sizes.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-1">Available Sizes:</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.sizes.map((size) => (
                        <span key={size.size} className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {size.size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                  <p className="text-gray-600 mb-2">Email: {item.email}</p>
                  <p className="text-gray-600 mb-2">Phone: {item.phone}</p>
                  <p className="text-gray-600 mb-2">Join Date: {item.joinDate}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Artisan Documents</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-500 text-sm">ID Verification</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-700">Aadhar Card</span>
                    <button className="text-amber-900 hover:underline text-sm">View</button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Craft Certification</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-700">Artisan Certificate</span>
                    <button className="text-amber-900 hover:underline text-sm">View</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Review Notes (optional)
          </label>
          <textarea
            id="notes"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent"
            placeholder="Add any notes about this verification..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={() => onVerify(false)}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => onVerify(true)}
            className="px-4 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 transition-colors"
          >
            Approve
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;