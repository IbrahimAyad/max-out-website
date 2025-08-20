"use client";

import { useState } from "react";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { Plus, Pencil, Trash } from "lucide-react";
import { AddressForm } from "@/components/account/AddressForm";

interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressBookPage() {
  const { notifySuccess, notifyError } = useNotifications();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Home",
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "Detroit",
      state: "MI",
      zipCode: "48201",
      phone: "(313) 555-0123",
      isDefault: true,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleSaveAddress = async (addressData: Omit<Address, "id">) => {
    try {
      if (editingAddress) {
        // Update existing address
        setAddresses(addresses.map((addr) =>
          addr.id === editingAddress.id
            ? { ...addressData, id: editingAddress.id }
            : addr
        ));
        notifySuccess("Address Updated", "Your address has been updated successfully");
      } else {
        // Add new address
        const newAddress = {
          ...addressData,
          id: Date.now().toString(),
        };
        setAddresses([...addresses, newAddress]);
        notifySuccess("Address Added", "New address has been added to your address book");
      }
      
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      notifyError("Save Failed", "Failed to save address");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
      notifySuccess("Address Deleted", "Address has been removed from your address book");
    }
  };

  const handleSetDefault = async (id: string) => {
    setAddresses(addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    })));
    notifySuccess("Default Updated", "Default address has been updated");
  };

  if (showForm) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {editingAddress ? "Edit Address" : "Add New Address"}
        </h2>
        <AddressForm
          address={editingAddress}
          onSave={handleSaveAddress}
          onCancel={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Address Book</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gold hover:bg-gold/90 text-black font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Address</span>
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No addresses saved yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-gold hover:text-gold/80 font-medium"
            >
              Add your first address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`
                  border rounded-lg p-4
                  ${address.isDefault
                    ? "border-gold bg-gold/5"
                    : "border-gray-200"
                  }
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{address.label}</h3>
                    {address.isDefault && (
                      <span className="inline-block mt-1 text-xs bg-gold text-black px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingAddress(address);
                        setShowForm(true);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    {address.firstName} {address.lastName}
                  </p>
                  <p>{address.address}</p>
                  <p>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="mt-2">{address.phone}</p>
                </div>

                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="mt-3 text-sm text-gold hover:text-gold/80 font-medium"
                  >
                    Set as default
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Your default address will be automatically selected during checkout.
          You can always choose a different address at checkout time.
        </p>
      </div>
    </div>
  );
}