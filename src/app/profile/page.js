'use client';

import { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const { data: session, status: sessionStatus, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (sessionStatus === 'authenticated' && session) {
      // Fetch latest user data from database
      fetchLatestUserData();
    }
  }, [sessionStatus, session, router]);

  const fetchLatestUserData = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          address: data.user.address || ''
        });
        if (data.user.image) {
          setPreviewUrl(data.user.image);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('address', formData.address);
      
      if (selectedImage) {
        submitData.append('image', selectedImage);
      }

      const response = await fetch('/api/profile/update', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data = await response.json();
      
      console.log('Profile update response:', data);
      console.log('New image URL:', data.user.image);
      
      // Update the session with new data
      const updateResult = await update({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        image: data.user.image || session.user.image
      });
      
      console.log('Session update result:', updateResult);

      setMessage('Profile updated successfully!');
      setSelectedImage(null);
      
      // Force a session refresh and page reload to ensure the Navbar updates
      setTimeout(async () => {
        try {
          // Force refresh the session
          await getSession();
          window.location.reload();
        } catch (error) {
          console.error('Error refreshing session:', error);
          window.location.reload();
        }
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <main className="flex-grow flex items-center justify-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <main className="flex-grow p-6 relative z-10">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-600/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Profile Settings</h1>
            <p className="text-gray-300 text-sm">Update your personal information and profile picture</p>
          </div>
          
          {message && (
            <div className={`mb-6 p-4 rounded-lg backdrop-blur-sm ${
              message.startsWith('Error') 
                ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-300' 
                : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="text-center">
              <div className="mb-6">
                {previewUrl ? (
                  <div className="relative inline-block">
                    <Image
                      src={previewUrl}
                      alt="Profile"
                      width={120}
                      height={120}
                      className="rounded-full border-4 border-slate-600/50 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setPreviewUrl(session?.user?.image || '');
                      }}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-slate-600/50 to-slate-500/50 rounded-full flex items-center justify-center mx-auto border-4 border-slate-600/50">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="image" className="cursor-pointer">
                  <span className="group relative px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02] transform inline-block">
                    <span className="relative z-10">{previewUrl ? 'Change Image' : 'Upload Image'}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </span>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 font-medium mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-700/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-700/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-300 font-medium mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-700/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-gray-300 font-medium mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-700/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                  placeholder="Enter your address"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transform focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">{loading ? 'Updating...' : 'Update Profile'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>

          {/* Account Information */}
          <div className="mt-8 pt-6 border-t border-slate-600/30">
            <h2 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Account Information</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <p><span className="font-medium text-white">Role:</span> {session?.user?.role || 'User'}</p>
              <p><span className="font-medium text-white">Member since:</span> {session?.user?.createdAt ? new Date(session.user.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 