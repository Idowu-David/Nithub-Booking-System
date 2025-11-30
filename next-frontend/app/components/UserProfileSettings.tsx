// src/components/UserProfileSettings.tsx
import React, { useState } from 'react';

interface UserProfileSettingsProps {
  // A mock function to update user state globally (if implemented)
  onUpdate: (data: UserProfileData) => void; 
}

export interface UserProfileData {
  fullName: string;
  email: string;
  phone: string;
  defaultFloor: string;
  notificationPref: 'email' | 'sms' | 'none';
}

const initialUserData: UserProfileData = {
  fullName: "Alice Johnson",
  email: "alice.johnson@flexdesk.com",
  phone: "+234 800 123 4567",
  defaultFloor: "Floor 2",
  notificationPref: 'email',
}

const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({ onUpdate }) => {
  const [formData, setFormData] = useState<UserProfileData>(initialUserData);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call
    console.log("Saving profile data:", formData);
    onUpdate(formData); 
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const InputField: React.FC<{ label: string, name: keyof UserProfileData, type?: string }> = ({ label, name, type = 'text' }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={formData[name] as string}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        required
      />
    </div>
  );

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">👤 Profile & Settings</h2>
      
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl font-semibold text-indigo-700 border-b pb-2 mb-4">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" name="fullName" />
            <InputField label="Email Address" name="email" type="email" />
            <InputField label="Phone Number" name="phone" />
          </div>

          <h3 className="text-xl font-semibold text-indigo-700 border-b pb-2 pt-4 mb-4">Workspace Preferences</h3>

          <div>
            <label htmlFor="defaultFloor" className="block text-sm font-medium text-gray-700">Preferred Default Floor</label>
            <select
              name="defaultFloor"
              id="defaultFloor"
              value={formData.defaultFloor}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            >
              <option>Floor 1</option>
              <option>Floor 2</option>
              <option>Floor 3</option>
            </select>
          </div>

          <div>
            <label htmlFor="notificationPref" className="block text-sm font-medium text-gray-700">Booking Notification Preference</label>
            <select
              name="notificationPref"
              id="notificationPref"
              value={formData.notificationPref}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="none">None</option>
            </select>
          </div>
          
          <div className="pt-4 flex justify-end items-center space-x-4">
            {isSaved && (
              <span className="text-sm text-green-600 font-medium flex items-center">
                ✅ Settings Saved!
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileSettings;