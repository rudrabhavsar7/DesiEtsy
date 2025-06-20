import React,{useState} from "react";
import {motion} from 'framer-motion'
const VerificationModal = ({ item, type, onClose, onVerify }) => {
  const [notes, setNotes] = useState("");

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
            {type === "product" ? "Product Verification" : "Artisan Approval"}
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-amber-900 transition-colors"
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

        <div className="mb-6">
          {type === "product" ? (
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
                <p className="text-gray-600 mb-2">
                  Artisan: {item.artisanName}
                </p>
                <p className="text-gray-600 mb-2">
                  Price: ₹{item.offerPrice}{" "}
                  <span className="line-through text-gray-400">
                    ₹{item.price}
                  </span>
                </p>

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
                        <span
                          key={size.size}
                          className="px-2 py-1 bg-gray-100 rounded text-sm"
                        >
                          {size.size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                  <p className="text-gray-600 mb-2">Email: {item.email}</p>
                  <p className="text-gray-600 mb-2">Phone: {item.phone}</p>
                  <p className="text-gray-600 mb-2">
                    Join Date: {item.createdAt.split("T")[0]}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Aadhaar ID: {item.Id || "XXXX XXXX XXXX"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Address Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {item.address && (
                    <>
                      <p className="text-gray-600 mb-1">
                        {item.address.street}
                      </p>
                      <p className="text-gray-600 mb-1">
                        {item.address.city}, {item.address.state}
                      </p>
                      <p className="text-gray-600 mb-1">
                        {item.address.country} - {item.address.zipCode}
                      </p>
                    </>
                  )}
                  {!item.address && (
                    <p className="text-gray-500">
                      No address information available
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
            onClick={() => onVerify({ id: item._id, status: false, notes })}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => onVerify({ id: item._id, status: true, notes })}
            className="px-4 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 transition-colors"
          >
            Approve
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VerificationModal;
