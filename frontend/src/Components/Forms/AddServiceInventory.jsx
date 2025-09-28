import React, { useState } from "react";

export default function AddInventoryModal({ isOpen, onClose, onSave, types, isLoading }) {
  const [newItem, setNewItem] = useState({
    item_name: "",
    item_code: "",
    quantity: 0,
    price: 0,
    type: types.length > 0 ? types[0].type : ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newItem);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Inventory Item</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <input
              type="text"
              name="item_name"
              value={newItem.item_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Item Code</label>
            <input
              type="text"
              name="item_code"
              value={newItem.item_code}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              name="type"
              value={newItem.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
              disabled={isLoading}
            >
              {types.map((typeObj) => (
                <option key={typeObj.type} value={typeObj.type}>
                  {typeObj.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              min="0"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={newItem.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              min="0"
              step="0.01"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}