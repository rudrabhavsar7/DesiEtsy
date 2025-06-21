import React, { useState, useEffect } from 'react';

const EditProductModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  product 
}) => {
  const [editedProduct, setEditedProduct] = useState({
    inStock: false,
    quantity: 0
  });

  useEffect(() => {
    if (product) {
      setEditedProduct({
        inStock: product.inStock || false,
        quantity: product.quantity || 0
      });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    onSave(editedProduct);
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-xl font-semibold text-amber-900 mb-2">Edit Product</h3>
        <p className="text-gray-600 mb-6">Update inventory for "{product.name}"</p>
        
        <div className="mb-6 space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="inStock"
              name="inStock"
              checked={editedProduct.inStock}
              onChange={handleChange}
              className="h-4 w-4 text-amber-900 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
              In Stock
            </label>
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={editedProduct.quantity}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;