import React from "react";
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
                <tr key={artisan._id} className="border-t">
                  <td className="px-4 py-2">{artisan.name}</td>
                  <td className="px-4 py-2">{artisan.createdAt.split("T")[0]}</td>
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

export default OverviewTab;