import React, { useEffect, useState } from "react";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import ServiceInventoryTable from "../../Components/Tables/ServiceInventoryTable";
import { 
  getAllServiceInventries, 
  createServiceInventory,
  updateServiceInventory,
  deleteServiceInventory
} from "../../Api/ServiceInventriesAPI";
import { toast } from "react-toastify";
import AddInventoryModal from "../../Components/Forms/AddServiceInventory";
import EditInventoryModal from "../../Components/Forms/EditInventory";
import SearchInventory from "../../Components/Forms/SearchInventory";

export default function ServiceInventory() {
  const [service_inventries, setServiceInventories] = useState([]);
  const [serviceInventryData, setServiceInventryData] = useState([]);
  const [inventory_type, setInventoryType] = useState("oil_fluid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const inventoryTypes = [
    { type: "oil_fluid", label: "Oil & Fluids" },
    { type: "filters", label: "Filters" },
    { type: "mechanical", label: "Mechanical" },
  ];

  useEffect(() => {
    const get_all_service_inventries = async () => {
      try {
        setIsLoading(true);
        const response = await getAllServiceInventries();
        if (response.status === 200) {
          const sortedData = response.data.inventries
            ? [...response.data.inventries].sort((a, b) => a.item_name.localeCompare(b.item_name))
            : [];
          setServiceInventories(sortedData);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data || "Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };
    get_all_service_inventries();
  }, []);

  useEffect(() => {
    if (service_inventries.length > 0) {
      const filteredItems = service_inventries
        .filter((item) => item.type === inventory_type)
        .sort((a, b) => a.item_name.localeCompare(b.item_name));
      setServiceInventryData(filteredItems);
    }
  }, [inventory_type, service_inventries]);

  const handleAddItem = async (newItem) => {
    try {
      setIsLoading(true);
      const response = await createServiceInventory(newItem);
      
      if (response.status === 201) {
        setServiceInventories(prev => [...prev, response.data.inventory]);
        toast.success("Item added successfully!");
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to add item:", error);
      toast.error(error.response?.data?.message || "Failed to add item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setActionType('edit');
    setIsSearchModalOpen(true);
  };

  const handleDeleteClick = () => {
    setActionType('delete');
    setIsSearchModalOpen(true);
  };

  const handleItemSelect = (item) => {
    setCurrentItem(item);
    setIsSearchModalOpen(false);
    
    if (actionType === 'edit') {
      setIsEditModalOpen(true);
    } else if (actionType === 'delete') {
      setIsDeleteModalOpen(true);
    }
  };

  const handleUpdateItem = async (updatedItem) => {
    try {
      setIsLoading(true);
      const response = await updateServiceInventory(
        currentItem.service_inventory_id, 
        updatedItem
      );
      
      if (response.status === 200) {
        setServiceInventories(prev => 
          prev.map(item => 
            item.service_inventory_id === currentItem.service_inventory_id 
              ? response.data.inventory 
              : item
          )
        );
        toast.success("Item updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update item:", error);
      toast.error(error.response?.data?.message || "Failed to update item");
    } finally {
      setIsLoading(false);
      setIsEditModalOpen(false);
      setIsSearchModalOpen(true);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setIsSearchModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      await deleteServiceInventory(currentItem.service_inventory_id);
      setServiceInventories(prev => 
        prev.filter(item => item.service_inventory_id !== currentItem.service_inventory_id)
      );
      toast.success("Item deleted successfully!");
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error(error.response?.data?.message || "Failed to delete item");
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setIsSearchModalOpen(true);
    }
  };

  const enhancedInventoryData = serviceInventryData.map((item, index) => ({
    ...item,
    index: index + 1,
    actions: (
      <div className="flex gap-2">
        <button
          onClick={() => {
            setCurrentItem(item);
            setActionType('edit');
            setIsEditModalOpen(true);
          }}
          className="primary-btn"
          disabled={isLoading}
        >
          Edit
        </button>
        <button
          onClick={() => {
            setCurrentItem(item);
            setActionType('delete');
            setIsDeleteModalOpen(true);
          }}
          className="danger-btn"
          disabled={isLoading}
        >
          Delete
        </button>
      </div>
    )
  }));

  const serviceInventoryElement = (
    <div className="h-full pb-5">
      <div className="w-full h-full">
        {isLoading ? (
          <p>Loading...</p>
        ) : service_inventries.length > 0 ? (
          <div className="flex flex-col md:flex-row w-full h-full">
            <div className="md:hidden flex justify-end gap-3 mb-3 px-2">
              <button 
                className="submit-btn"
                onClick={() => setIsAddModalOpen(true)}
                disabled={isLoading}
              >
                Add
              </button>
              <button 
                className="primary-btn"
                onClick={handleEditClick}
                disabled={isLoading}
              >
                Edit
              </button>
              <button 
                className="danger-btn"
                onClick={handleDeleteClick}
                disabled={isLoading}
              >
                Delete
              </button>
            </div>

            <div className="flex md:w-[20%] flex-col justify-start border-r pr-3 border-r-black h-full mt-6">
              {inventoryTypes.map(({ type, label }) => (
                <button
                  key={type}
                  className={`${
                    inventory_type === type ? "shadow-lg bg-primary" : ""
                  } px-6 border py-3 font-semibold rounded-lg shadow-inner transition-all duration-300 hover:shadow-md active:shadow-none mb-3`}
                  onClick={() => setInventoryType(type)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-col w-full items-center">
              <ServiceInventoryTable
                className="overflow-hidden"
                data={enhancedInventoryData}
              />
            </div>
          </div>
        ) : (
          <p>No inventory items found</p>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <NormalBackground
        title="Service Inventory"
        componentName={() => (
          <div>
            <div className="hidden md:flex flex-row justify-end gap-5 mb-2 px-4">
              <button 
                className="submit-btn"
                onClick={() => setIsAddModalOpen(true)}
                disabled={isLoading}
              >
                Add new
              </button>
              <button 
                className="primary-btn"
                onClick={handleEditClick}
                disabled={isLoading}
              >
                Edit Item
              </button>
              <button 
                className="danger-btn"
                onClick={handleDeleteClick}
                disabled={isLoading}
              >
                Delete Item
              </button>
            </div>
            {serviceInventoryElement}
          </div>
        )}
      />
      
      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddItem}
        types={inventoryTypes}
        isLoading={isLoading}
      />
      
      <EditInventoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setIsSearchModalOpen(true);
        }}
        onSave={handleUpdateItem}
        item={currentItem}
        types={inventoryTypes}
        isLoading={isLoading}
      />

      <SearchInventory
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelect={handleItemSelect}
        inventoryItems={service_inventries}
        actionType={actionType}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete "<span className="font-bold">{currentItem?.item_name} - {currentItem?.item_code}</span>"?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="danger-btn"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}