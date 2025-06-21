import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const EditProductModal = ({ product, categories, subcategories, onClose, onUpdate }) => {
  const { axios } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: [''],
    price: '',
    offerPrice: '',
    category: '',
    subcategory: '',
    sizes: [],
    quantity: 0,
    inStock: true
  });
  
  const [availableSizes, setAvailableSizes] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  const [images, setImages] = useState([]);
  const [imagesToUpload, setImagesToUpload] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  
  // Check if selected category is fashion
  const isFashionCategory = selectedCategory?.toLowerCase().includes('fashion') || 
                           selectedCategory?.toLowerCase().includes('clothing') ||
                           selectedCategory?.toLowerCase().includes('apparel');
  
  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    subcat => subcat.category === selectedCategory
  );

  useEffect(() => {
    if (product) {
      // Find the category path for the product's category
      const categoryPath = categories.find(cat => 
        cat.title === product.category || 
        subcategories.some(subcat => 
          subcat.title === product.category && subcat.category === cat.path
        )
      )?.path || '';
      
      setSelectedCategory(categoryPath);
      
      // Initialize form data from product
      setFormData({
        name: product.name || '',
        description: Array.isArray(product.description) ? product.description : [product.description || ''],
        price: product.price || '',
        offerPrice: product.offerPrice || '',
        category: product.category || '',
        sizes: product.sizes || [],
        quantity: product.quantity || 0,
        inStock: product.inStock !== false // Default to true if not explicitly false
      });
      
      // Initialize images
      if (product.images && product.images.length > 0) {
        setImages(product.images.map(img => ({
          url: img,
          isExisting: true
        })));
      }
    }
  }, [product, categories, subcategories]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };
  
  const handleCategoryChange = (e) => {
    const categoryPath = e.target.value;
    setSelectedCategory(categoryPath);
    
    // Reset subcategory when category changes
    setFormData(prev => ({ 
      ...prev, 
      category: '',
      // Reset sizes if changing to/from fashion category
      sizes: []
    }));
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
    
    // Limit to 5 images total (existing + new)
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    
    // Add new images to upload
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file,
      isExisting: false
    }));
    
    setImages(prev => [...prev, ...newImages]);
    setImagesToUpload(prev => [...prev, ...files]);
  };
  
  const removeImage = (index) => {
    const imageToRemove = images[index];
    
    // If it's an existing image, add to delete list
    if (imageToRemove.isExisting) {
      setImagesToDelete(prev => [...prev, imageToRemove.url]);
    }
    
    // Remove from images array
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // If it's a new image, remove from upload list
    if (!imageToRemove.isExisting && imageToRemove.file) {
      setImagesToUpload(prev => prev.filter(file => 
        URL.createObjectURL(file) !== imageToRemove.url
      ));
    }
  };

  // Handle size selection
  const handleSizeToggle = (size) => {
    const currentSizes = [...formData.sizes];
    if (currentSizes.includes(size)) {
      // Remove size if already selected
      setFormData(prev => ({
        ...prev,
        sizes: prev.sizes.filter(s => s !== size)
      }));
    } else {
      // Add size if not already selected
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, size]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.name || !formData.price || !formData.offerPrice || !formData.category) {
        toast.error('Please fill all required fields');
        setIsSubmitting(false);
        return;
      }
      
      if (isFashionCategory && formData.sizes.length === 0) {
        toast.error('Please select at least one size for fashion items');
        setIsSubmitting(false);
        return;
      }
      
      if (images.length === 0) {
        toast.error('Please add at least one product image');
        setIsSubmitting(false);
        return;
      }
      
      // Create form data for API request
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', JSON.stringify(formData.description));
      productData.append('price', Number(formData.price));
      productData.append('offerPrice', Number(formData.offerPrice));
      productData.append('category', formData.category);
      productData.append('inStock', formData.inStock);
      productData.append('quantity', formData.quantity);
      
      if (formData.sizes.length > 0) {
        productData.append('sizes', JSON.stringify(formData.sizes));
      }
      
      imagesToUpload.forEach(file => {
        productData.append('images', file);
      });
      
      // Add images to delete
      if (imagesToDelete.length > 0) {
        productData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }
      
      // Add existing images to keep
      
      const imagesToKeep = images
        .filter(img => img.isExisting && !imagesToDelete.includes(img.url))
        .map(img => img.url);

      if (imagesToKeep.length > 0) {
        productData.append('existingImages', JSON.stringify(imagesToKeep));
      }
      
      // Send update request
      console.log('Submitting product data:', formData);
      const { data } = await axios.put(
        `/api/artisan/products/update/${product._id}`,
        productData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      if (data.success) {
        toast.success('Product updated successfully!');
        if (onUpdate) onUpdate(data.product);
        onClose();
      } else {
        toast.error(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
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
          <h2 className="text-2xl font-bold text-amber-900">Edit Product</h2>
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
                  placeholder="Enter price"
                  required 
                />
              </div>
              <div>
                <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700 mb-1">Offer Price</label>
                <input 
                  type="number" 
                  id="offerPrice" 
                  name="offerPrice" 
                  value={formData.offerPrice} 
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
                  placeholder="Enter offer price"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
            <select 
              id="category" 
              name="category" 
              value={selectedCategory} 
              onChange={handleCategoryChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.path} value={cat.path}>{cat.title}</option>
              ))}
            </select>
          </div>
          
          {isFashionCategory && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(size => (
                  <button 
                    key={size} 
                    onClick={() => handleSizeToggle(size)} 
                    className={`px-3 py-1 rounded-full ${formData.sizes.includes(size) ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            {formData.description.map((desc, index) => (
              <div key={index} className="flex items-center mb-2">
                <textarea 
                  rows="2" 
                  value={desc} 
                  onChange={(e) => handleDescriptionChange(index, e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
                  placeholder="Enter description"
                />
                <button 
                  type="button" 
                  onClick={() => removeDescriptionField(index)} 
                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  Remove
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addDescriptionField} 
              className="text-amber-500 hover:text-amber-700 focus:outline-none"
            >
              Add Description Field
            </button>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input 
              type="number" 
              id="quantity" 
              name="quantity" 
              value={formData.quantity} 
              onChange={handleChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
              placeholder="Enter quantity"
              min="0"
              required 
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">In Stock</label>
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                id="inStock" 
                name="inStock" 
                checked={formData.inStock} 
                onChange={handleChange} 
                className="form-checkbox h-4 w-4 text-amber-500 focus:ring-amber-200"
              />
              <span className="ml-2">Yes</span>
            </label>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
            <div className="flex flex-wrap gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img 
                    src={img.url} 
                    alt={`Product ${index}`} 
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeImage(index)} 
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <input 
              type="file" 
              id="images" 
              name="images" 
              accept="image/*" 
              multiple 
              onChange={handleImageUpload} 
              className="hidden"
            />
            <label 
              htmlFor="images" 
              className="mt-2 inline-block px-4 py-2 bg-amber-500 text-white rounded-md cursor-pointer hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              Upload Images
            </label>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-4 py-2 bg-amber-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              {isSubmitting ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditProductModal;