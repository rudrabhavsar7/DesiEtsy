import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const CategoryTab = ({ categories, subcategories, onAddCategory, onAddSubcategory, onDeleteCategory, onDeleteSubcategory }) => {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-semibold text-amber-900 mb-4 md:mb-0">Categories & Subcategories</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="bg-amber-900 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
          <button
            onClick={() => setShowAddSubcategoryModal(true)}
            className="bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Subcategory
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories List */}
        <div className="bg-amber-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-amber-900">Categories</h3>
          <div className="overflow-y-auto max-h-[400px]">
            {categories.length > 0 ? (
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li
                    key={category._id || category.path}
                    className="bg-white p-3 rounded-md shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium">{category.title}</span>
                      <p className="text-sm text-gray-500">Path: /{category.path}</p>
                    </div>
                    <button
                      onClick={() => onDeleteCategory(category._id || category.path)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete Category"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No categories found</p>
            )}
          </div>
        </div>

        {/* Subcategories List */}
        <div className="bg-amber-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-amber-900">Subcategories</h3>
          <div className="overflow-y-auto max-h-[400px]">
            {subcategories.length > 0 ? (
              <ul className="space-y-2">
                {subcategories.map((subcategory) => (
                  <li
                    key={subcategory._id || subcategory.path}
                    className="bg-white p-3 rounded-md shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium">{subcategory.title}</span>
                      <p className="text-sm text-gray-500">
                        Category: {subcategory.category}
                      </p>
                      <p className="text-sm text-gray-500">Path: /{subcategory.path}</p>
                    </div>
                    <button
                      onClick={() => onDeleteSubcategory(subcategory._id || subcategory.path)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete Subcategory"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No subcategories found</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <AddCategoryModal
          onClose={() => setShowAddCategoryModal(false)}
          onAddCategory={onAddCategory}
        />
      )}

      {/* Add Subcategory Modal */}
      {showAddSubcategoryModal && (
        <AddSubcategoryModal
          categories={categories}
          onClose={() => setShowAddSubcategoryModal(false)}
          onAddSubcategory={onAddSubcategory}
        />
      )}
    </div>
  );
};

// Add Category Modal Component
const AddCategoryModal = ({ onClose, onAddCategory }) => {
  const [formData, setFormData] = useState({
    title: "",
    path: "",
    tagline:"",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If updating the title, also generate a path slug
    if (name === "title") {
      const pathSlug = value.toLowerCase().replace(/\s+/g, "-");
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        path: pathSlug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Adding category:", formData);
    try {
      await onAddCategory(formData);
      onClose();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-amber-900">Add New Category</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="path" className="block text-sm font-medium text-gray-700 mb-1">
                URL Path*
              </label>
              <input
                type="text"
                id="path"
                name="path"
                value={formData.path}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="category-url-path"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be used in the URL: /products/[path]
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="path" className="block text-sm font-medium text-gray-700 mb-1">
                TagLine*
              </label>
              <input
                type="text"
                id="tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Your category tagline"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Category Image*
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                accept="image/*"
                required
              />
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
                {isSubmitting ? "Adding..." : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Add Subcategory Modal Component
const AddSubcategoryModal = ({ categories, onClose, onAddSubcategory }) => {
  const [formData, setFormData] = useState({
    title: "",
    path: "",
    category: "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If updating the title, also generate a path slug
    if (name === "title") {
      const pathSlug = value.toLowerCase().replace(/\s+/g, "-");
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        path: pathSlug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log(formData);
      await onAddSubcategory(formData);
      onClose();
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast.error("Failed to add subcategory");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-amber-900">Add New Subcategory</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory Name*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter subcategory name"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="path" className="block text-sm font-medium text-gray-700 mb-1">
                URL Path*
              </label>
              <input
                type="text"
                id="path"
                name="path"
                value={formData.path}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="subcategory-url-path"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be used in the URL: /products/[category]/[path]
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id || category.path} value={category.title}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory Image*
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                accept="image/*"
                required
              />
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
                {isSubmitting ? "Adding..." : "Add Subcategory"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CategoryTab;