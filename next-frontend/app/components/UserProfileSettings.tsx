import React, { useState } from 'react';

// Exporting the interface is crucial for User.tsx to access the profile structure
export interface UserProfileData { 
  fullName: string;
  email: string;
  phone: string;
  defaultFloor: string;
  notificationPref: 'email' | 'sms' | 'none';
}

interface UserProfileSettingsProps {
  onUpdate: (data: UserProfileData) => void; 
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
    setIsSaved(false); // Reset saved status on edit
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving profile data:", formData);
    onUpdate(formData); 
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Dark Glassmorphism Input Style
  const inputClasses = "mt-1 block w-full rounded-lg bg-gray-800/70 text-white border border-white/10 shadow-inner p-3 focus:ring-indigo-400 focus:border-indigo-400 sm:text-sm transition-all";

  const InputField: React.FC<{ label: string, name: keyof UserProfileData, type?: string }> = ({ label, name, type = 'text' }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={formData[name] as string}
        onChange={handleChange}
        className={inputClasses}
        required
      />
    </div>
  );

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-6">👤 Profile & Settings</h2>
      
      <div className="bg-gray-900/70 backdrop-blur-xl p-8 rounded-xl shadow-2xl border border-white/10 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl font-semibold text-indigo-300 border-b border-white/10 pb-2 mb-4">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" name="fullName" />
            <InputField label="Email Address" name="email" type="email" />
            <InputField label="Phone Number" name="phone" />
          </div>

          <h3 className="text-xl font-semibold text-indigo-300 border-b border-white/10 pb-2 pt-4 mb-4">Workspace Preferences</h3>

          <div>
            <label htmlFor="defaultFloor" className="block text-sm font-medium text-gray-300">Preferred Default Floor</label>
            <select
              name="defaultFloor"
              id="defaultFloor"
              value={formData.defaultFloor}
              onChange={handleChange}
              className={inputClasses} 
            >
              <option className="bg-gray-800">Floor 1</option>
              <option className="bg-gray-800">Floor 2</option>
              <option className="bg-gray-800">Floor 3</option>
            </select>
          </div>

          <div>
            <label htmlFor="notificationPref" className="block text-sm font-medium text-gray-300">Booking Notification Preference</label>
            <select
              name="notificationPref"
              id="notificationPref"
              value={formData.notificationPref}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="email" className="bg-gray-800">Email</option>
              <option value="sms" className="bg-gray-800">SMS</option>
              <option value="none" className="bg-gray-800">None</option>
            </select>
          </div>
          
          <div className="pt-4 flex justify-end items-center space-x-4">
            {isSaved && (
              <span className="text-sm text-green-400 font-medium flex items-center">
                ✅ Settings Saved!
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/50"
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