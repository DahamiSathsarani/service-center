import React, { useState, useEffect } from "react";

export default function EditInventoryModal({ 
  isOpen, 
  onClose, 
  onSave, 
  item, 
  types,
  isLoading
}) {
  const [editValues, setEditValues] = useState({
    item_name: "",
    item_code: "",
    quantity: 0,
    price: 0,
    type: ""
  });

  useEffect(() => {
    if (item) {
      setEditValues({
        item_name: item.item_name,
        item_code: item.item_code,
        quantity: item.quantity,
        price: item.price,
        type: item.type
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editValues);
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Inventory Item</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <input
              type="text"
              name="item_name"
              value={editValues.item_name}
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
              value={editValues.item_code}
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
              value={editValues.type}
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
              value={editValues.quantity}
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
              value={editValues.price}
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