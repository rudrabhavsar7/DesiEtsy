import React from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const ProductsTab = ({ products, currency, onAddProduct, title, emptyMessage, onEditProduct }) => {

  const {axios} = useAppContext();
  const handleProductDelete = async (productId) => {
    try {

      console.log("Deleting product:", productId);
      const {data} = await axios.delete(`api/artisan/products/delete/${productId}`)

      if(data.success){
        console.log("Product deleted successfully");
        toast.success("Product deleted successfully");
      }
      else{
        console.error("Failed to delete product:", data.error);
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error.message);
      toast.error("Failed to delete product");
    }

  }
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
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
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="px-4 py-2 flex items-center">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded mr-2"
                  />
                  {product.name}
                </td>
                <td className="px-4 py-2">
                  {currency}
                  {product.offerPrice}
                </td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">
                  <button onClick={() => onEditProduct(product)} className="text-blue-600 hover:text-blue-800 mr-2">
                    Edit
                  </button>
                  <button
                    onClick={() => handleProductDelete(product._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTab;
