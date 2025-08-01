'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function TenantApplicationForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentAddress: '',
    employmentStatus: '',
    income: '',
    previousLandlordName: '',
    previousLandlordContact: '',
    notes: ''
  });
  const [idProof, setIdProof] = useState(null);
  const [employmentProof, setEmploymentProof] = useState(null);
  const [rentalHistory, setRentalHistory] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e, setFile) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In the handleSubmit function, update the error handling
    try {
      // Create FormData object for file uploads
      const submitData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Add files
      if (idProof) submitData.append('identificationDocument', idProof);
      if (employmentProof) submitData.append('proofOfIncome', employmentProof);
      if (rentalHistory) submitData.append('rentalHistory', rentalHistory);
      
      // Submit to API
      const response = await fetch('/api/tenant-verification', {
        method: 'POST',
        body: submitData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }
      
      // Redirect to status page
      router.push('/dashboard/status');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Failed to submit application: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-600/30">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Tenant Verification Application</h1>
            <p className="text-gray-300 text-lg">Complete your application to get verified as a tenant</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-6 rounded-xl border border-slate-600/30">
              <h2 className="text-xl font-semibold text-white mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-700/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-700/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-700/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="currentAddress">Current Address</label>
                  <input
                    id="currentAddress"
                    name="currentAddress"
                    type="text"
                    value={formData.currentAddress}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-700/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter your current address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="employmentStatus">Employment Status</label>
                  <select
                    id="employmentStatus"
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-700/50 text-white backdrop-blur-sm transition-all duration-300"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Self-employed">Self-employed</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Student">Student</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="income">Monthly Income</label>
                  <input
                    id="income"
                    name="income"
                    type="number"
                    value={formData.income}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-700/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter monthly income"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* References Section */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-6 rounded-xl border border-slate-600/30">
              <h2 className="text-xl font-semibold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">References</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="previousLandlordName">Previous Landlord Name</label>
                  <input
                    id="previousLandlordName"
                    name="previousLandlordName"
                    type="text"
                    value={formData.previousLandlordName}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-slate-700/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter previous landlord name"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="previousLandlordContact">Previous Landlord Contact</label>
                  <input
                    id="previousLandlordContact"
                    name="previousLandlordContact"
                    type="text"
                    value={formData.previousLandlordContact}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-slate-700/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter previous landlord contact"
                  />
                </div>
              </div>
            </div>
            
            {/* Document Upload Section */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-6 rounded-xl border border-slate-600/30">
              <h2 className="text-xl font-semibold text-white mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Document Upload</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="idProof">
                    Government ID Proof (Aadhaar, Passport, etc.)
                  </label>
                  <div className="relative">
                    <input
                      id="idProof"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, setIdProof)}
                      className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-slate-700/50 text-white backdrop-blur-sm transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-yellow-600 file:to-orange-600 file:text-white hover:file:from-yellow-700 hover:file:to-orange-700 file:cursor-pointer"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="employmentProof">
                    Employment Proof (Pay slips, Offer letter)
                  </label>
                  <div className="relative">
                    <input
                      id="employmentProof"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, setEmploymentProof)}
                      className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-slate-700/50 text-white backdrop-blur-sm transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-yellow-600 file:to-orange-600 file:text-white hover:file:from-yellow-700 hover:file:to-orange-700 file:cursor-pointer"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="rentalHistory">
                    Rental History (Optional)
                  </label>
                  <div className="relative">
                    <input
                      id="rentalHistory"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, setRentalHistory)}
                      className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-slate-700/50 text-white backdrop-blur-sm transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-yellow-600 file:to-orange-600 file:text-white hover:file:from-yellow-700 hover:file:to-orange-700 file:cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Notes Section */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-6 rounded-xl border border-slate-600/30">
              <h2 className="text-xl font-semibold text-white mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Additional Notes (Optional)</h2>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="w-full p-4 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-slate-700/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 resize-none"
                placeholder="Add any additional information or special requests..."
              ></textarea>
            </div>
            
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-cyan-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}