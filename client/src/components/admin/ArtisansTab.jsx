import React from "react";

const ArtisansTab = ({ artisans, onVerify, showActions = true, title }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">{title}</h2>

    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Join Date</th>
            {showActions && <th className="px-4 py-2 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {artisans.map((artisan) => (
            <tr key={artisan._id} className="border-t">
              <td className="px-4 py-2">{artisan.name}</td>
              <td className="px-4 py-2">{artisan.email}</td>
              <td className="px-4 py-2">{artisan.phone}</td>
              <td className="px-4 py-2">{artisan.createdAt.split("T")[0]}</td>
              {showActions && (
                <td className="px-4 py-2">
                  <button
                    onClick={() => onVerify(artisan)}
                    className="bg-amber-900 text-white px-3 py-1 rounded hover:bg-amber-800 transition-colors"
                  >
                    Review
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ArtisansTab;
