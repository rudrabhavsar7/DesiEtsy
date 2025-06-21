import React from 'react'

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

export default OrdersTab
