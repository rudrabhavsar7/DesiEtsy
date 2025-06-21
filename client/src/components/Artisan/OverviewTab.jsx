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

export default OverviewTab;