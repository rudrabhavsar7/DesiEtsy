import React from "react";

const ProductsTab = ({ pendingProducts,artisans, onVerify, onEdit, onDelete, title, status = "pending" }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">{title || "Products"}</h2>
    
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
              <td className="px-4 py-2">{artisans.find((artisan=> artisan._id === product.artisanId)).name}</td>
              <td className="px-4 py-2">{product.createdAt ? product.createdAt.split("T")[0] : "2023-10-18"}</td>
              <td className="px-4 py-2">
                {status === "pending" && (
                  <button 
                    onClick={() => onVerify(product)}
                    className="bg-amber-900 text-white px-3 py-1 rounded hover:bg-amber-800 transition-colors mr-2"
                  >
                    Review
                  </button>
                )}
                
                {status === "approved" && (
                  <>
                    <button 
                      onClick={() => onEdit(product)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors mr-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(product)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
                
                {status === "rejected" && (
                  <button 
                    onClick={() => onVerify(product)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                  >
                    Reconsider
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ProductsTab;