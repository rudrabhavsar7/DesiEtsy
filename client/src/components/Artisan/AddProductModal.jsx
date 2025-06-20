import React,{useState} from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";

const AddProductModal = ({ categories, subcategories, onClose }) => {
  const { isSeller, axios } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    description: [""],
    price: "",
    offerPrice: "",
    category: "",
    sizes: [],
    quantity: "",
    images: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSizes, setAvailableSizes] = useState([
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ]);
  const [sizeQuantities, setSizeQuantities] = useState({});

  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    (subcat) => subcat.category === selectedCategory
  );

  // Check if selected category is fashion
  const isFashionCategory =
    selectedCategory?.toLowerCase().includes("fashion") ||
    selectedCategory?.toLowerCase().includes("clothing") ||
    selectedCategory?.toLowerCase().includes("apparel");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const categoryPath = e.target.value;
    setSelectedCategory(categoryPath);
    // Reset subcategory when category changes
    setFormData((prev) => ({ ...prev, category: "", sizes: [] }));
    setSizeQuantities({});
  };

  const handleDescriptionChange = (index, value) => {
    const newDescription = [...formData.description];
    newDescription[index] = value;
    setFormData((prev) => ({ ...prev, description: newDescription }));
  };

  const addDescriptionField = () => {
    setFormData((prev) => ({
      ...prev,
      description: [...prev.description, ""],
    }));
  };

  const removeDescriptionField = (index) => {
    if (formData.description.length > 1) {
      const newDescription = [...formData.description];
      newDescription.splice(index, 1);
      setFormData((prev) => ({ ...prev, description: newDescription }));
    } else {
      toast.error("At least one description field is required");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 5 images
    if (formData.images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  // Handle size selection
  const handleSizeToggle = (size) => {
    const currentSizes = [...formData.sizes];
    if (currentSizes.includes(size)) {
      // Remove size if already selected
      const newSizes = currentSizes.filter((s) => s !== size);
      setFormData((prev) => ({
        ...prev,
        sizes: newSizes,
      }));

      // Remove quantity for this size
      const newSizeQuantities = { ...sizeQuantities };
      delete newSizeQuantities[size];
      setSizeQuantities(newSizeQuantities);
    } else {
      // Add size if not already selected
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, size],
      }));

      // Initialize quantity for this size
      setSizeQuantities((prev) => ({
        ...prev,
        [size]: 0,
      }));
    }
  };

  // Handle size quantity change
  const handleSizeQuantityChange = (size, value) => {
    setSizeQuantities((prev) => ({
      ...prev,
      [size]: parseInt(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare the data for submission
      const productData = { ...formData, artisanId: isSeller._id };

      console.log(productData);
      // Format sizes with quantities for fashion items
      if (isFashionCategory && formData.sizes.length > 0) {
        productData.sizes = formData.sizes.map((size) => ({
          size,
          quantity: sizeQuantities[size] || 0,
        }));
      }

      const { data } = await axios.post(
        "/api/artisan/products/add",
        productData
      );

      console.log(data);

      // // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1000));
      // toast.success('Product added successfully!');
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product.");
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name*
              </label>
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
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price*
                </label>
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
                <label
                  htmlFor="offerPrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Offer Price*
                </label>
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
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.path} value={cat.path}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="subcategory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subcategory*
              </label>
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
                {filteredSubcategories.map((subcat) => (
                  <option key={subcat.path} value={subcat.title}>
                    {subcat.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity field for non-fashion categories */}
          {!isFashionCategory && selectedCategory && (
            <div className="mb-6">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity*
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Available quantity"
                min="0"
                required
              />
            </div>
          )}

          {/* Sizes section with quantities - only show for fashion category */}
          {isFashionCategory && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes with Quantity
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {availableSizes.map((size) => (
                  <div
                    key={size}
                    className={`border rounded-md p-2 ${
                      formData.sizes.includes(size)
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{size}</span>
                      <button
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          formData.sizes.includes(size)
                            ? "bg-amber-900 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {formData.sizes.includes(size) ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        )}
                      </button>
                    </div>

                    {formData.sizes.includes(size) && (
                      <div>
                        <label
                          htmlFor={`qty-${size}`}
                          className="block text-xs text-gray-500 mb-1"
                        >
                          Quantity
                        </label>
                        <input
                          type="number"
                          id={`qty-${size}`}
                          value={sizeQuantities[size] || 0}
                          onChange={(e) =>
                            handleSizeQuantityChange(size, e.target.value)
                          }
                          className="w-full p-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                          min="0"
                          required
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {formData.sizes.length === 0 && isFashionCategory && (
                <p className="text-xs text-red-500 mt-1">
                  Please select at least one size for fashion items
                </p>
              )}
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Product Description*
              </label>
              <button
                type="button"
                onClick={addDescriptionField}
                className="text-xs text-amber-900 hover:text-amber-700 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Point
              </button>
            </div>

            {formData.description.map((desc, index) => (
              <div key={index} className="flex items-center mb-2">
                <textarea
                  rows="2"
                  value={desc}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images* (Max 5)
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-md p-4 text-center overflow-hidden">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className=" h-full w-full cursor-pointer absolute top-0 left-0 opacity-0"
              />
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 7H19a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2.091A5.972 5.972 0 0110 16zm0 1a2 2 0 100-4 2 2 0 000 4zm9-1a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">
                  Drag &amp; drop files here, or click to select files
                </p>
              </div>
            </div>
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Uploaded ${index}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
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
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddProductModal;
