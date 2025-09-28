import React, { useState } from 'react';

export default function SearchInventory({ 
  isOpen, 
  onClose, 
  onSelect, 
  inventoryItems,
  actionType 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = inventoryItems
  .filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_code.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => a.item_name.localeCompare(b.item_name)); // Alphabetical sort

  const handleSelect = (item) => {
    onSelect(item);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4">
          {actionType === 'edit' ? 'Edit Item' : 'Delete Item'} - Search Inventory
        </h2>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by item name or code..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto mb-4 border border-black-500">
          <table className="min-w-full border border-red-500">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border p-2 text-left">Item Name</th>
                <th className="border p-2 text-left">Item Code</th>
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-left">Select</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr 
                    key={item.service_inventory_id} 
                    className="hover:bg-gray-50"
                  >
                    <td className="border p-2">{item.item_name}</td>
                    <td className="border p-2">{item.item_code}</td>
                    <td className="border p-2">{item.type}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleSelect(item)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border p-2 text-center">No items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-2 pr-2">
          <button
            onClick={onClose}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}