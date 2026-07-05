"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { MapPin, Plus, Trash2, Edit2, Star } from "lucide-react";

const addressSchema = z.object({
  label: z.string().min(1, "Label is required (e.g., Home, Office)"),
  fullName: z.string().min(2, "Full Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(5, "Pincode is required"),
  country: z.string().default("India"),
});

export default function AddressesPage() {
  const { user, setUser } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addressSchema),
  });

  const onAddAddress = async (data) => {
    try {
      const response = await api.post(`/users/${user._id}/addresses`, data);
      setUser(response.data.data);
      toast.success("Address added successfully!");
      setIsAdding(false);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address");
    }
  };

  const onDeleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const response = await api.delete(`/users/${user._id}/addresses/${addressId}`);
      setUser(response.data.data);
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  const onSetDefault = async (addressId) => {
    try {
      const response = await api.patch(`/users/${user._id}/addresses/${addressId}/default`);
      setUser(response.data.data);
      toast.success("Default address updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to set default address");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">Saved Addresses</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your shipping addresses for a faster checkout experience.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Address
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="text-lg font-bold mb-6">Add New Address</h3>
          <form onSubmit={handleSubmit(onAddAddress)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Address Label (Home, Office)" {...register("label")} error={errors.label} />
              <Input label="Full Name" {...register("fullName")} error={errors.fullName} />
              <Input label="Phone Number" {...register("phone")} error={errors.phone} />
              <Input label="Street Address" {...register("street")} error={errors.street} />
              <Input label="City" {...register("city")} error={errors.city} />
              <Input label="State" {...register("state")} error={errors.state} />
              <Input label="Pincode / ZIP" {...register("pincode")} error={errors.pincode} />
              <Input label="Country" {...register("country")} error={errors.country} />
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" isLoading={isSubmitting}>Save Address</Button>
              <Button type="button" variant="outline" onClick={() => { setIsAdding(false); reset(); }}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {(!user?.addresses || user.addresses.length === 0) && !isAdding ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No addresses saved</h3>
          <p className="mt-1 text-sm text-gray-500 mb-6">Add an address to make your next checkout faster.</p>
          <Button onClick={() => setIsAdding(true)}>Add Address</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user?.addresses?.map((address) => (
            <div key={address._id} className={`p-6 rounded-2xl border-2 transition-all ${address.isDefault ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 dark:text-white capitalize">{address.label || "Address"}</span>
                  {address.isDefault && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  {!address.isDefault && (
                    <button onClick={() => onSetDefault(address._id)} className="text-gray-400 hover:text-primary-600 transition-colors" title="Set as default">
                      <Star className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => onDeleteAddress(address._id)} className="text-gray-400 hover:text-error-600 transition-colors" title="Delete">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium text-gray-900 dark:text-white mb-2">{address.fullName}</p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.pincode}</p>
                <p>{address.country}</p>
                <p className="pt-2">Phone: {address.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
