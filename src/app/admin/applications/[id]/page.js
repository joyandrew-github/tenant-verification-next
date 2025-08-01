'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function ApplicationDetail({ params }) {
  const { id } = use(params);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (sessionStatus === 'authenticated') {
      if (session.user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      
      fetchApplicationDetail();
    }
  }, [sessionStatus, session, router, id]);
  
  const fetchApplicationDetail = async () => {
    try {
      const response = await fetch(`/api/admin/applications/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch application details');
      }
      
      const data = await response.json();
      setApplication(data.application);
    } catch (error) {
      console.error('Error fetching application details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (newStatus, rejectionReason = '') => {
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, rejectionReason }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update application status');
      }
      
      // Update local state
      setApplication(prev => ({ ...prev, status: newStatus, rejectionReason }));
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update status. Please try again.');
    }
  };
  
  const handleReject = () => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason !== null) {
      handleStatusChange('rejected', reason);
    }
  };
  
  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <main className="flex-grow flex items-center justify-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
        </main>
      </div>
    );
  }
  
  if (!application) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <main className="flex-grow p-6 relative z-10">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-600/30 text-center">
            <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Application Not Found</h1>
            <p className="text-gray-300 mb-6">The application you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/admin/applications')}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300"
            >
              Back to Applications
            </button>
          </div>
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
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Application Details</h1>
            <button
              onClick={() => router.push('/admin/applications')}
              className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to List
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-600/30 mb-8">
            <div className="flex items-center justify-between pb-6 border-b border-slate-600/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600/50 to-slate-500/50 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{application.fullName?.charAt(0) || 'A'}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Application #{application._id.substring(0, 8)}</h2>
                  <p className="text-gray-400 text-sm">Submitted on {new Date(application.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-300 font-medium">Status:</span>
                <span className={
                  `px-4 py-2 rounded-full text-sm font-semibold border ${
                    application.status === 'approved' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    application.status === 'rejected' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }`
                }>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-6 rounded-xl border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-600/30">
                    <span className="text-gray-300 font-medium">Name:</span>
                    <span className="text-white">{application.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-600/30">
                    <span className="text-gray-300 font-medium">Email:</span>
                    <span className="text-white">{application.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-600/30">
                    <span className="text-gray-300 font-medium">Phone:</span>
                    <span className="text-white">{application.phone}</span>
                  </div>
                  <div className="flex justify-between items-start py-2">
                    <span className="text-gray-300 font-medium">Address:</span>
                    <span className="text-white text-right">{application.currentAddress}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-6 rounded-xl border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Employment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-600/30">
                    <span className="text-gray-300 font-medium">Status:</span>
                    <span className="text-white">{application.employmentStatus}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-300 font-medium">Income:</span>
                    <span className="text-cyan-400 font-semibold">${application.income}/month</span>
                  </div>
                </div>
              </div>
            </div>
            
            {application.previousLandlordName && (
              <div className="mt-8">
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-6 rounded-xl border border-slate-600/30">
                  <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">References</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-600/30">
                      <span className="text-gray-300 font-medium">Previous Landlord:</span>
                      <span className="text-white">{application.previousLandlordName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300 font-medium">Contact:</span>
                      <span className="text-white">{application.previousLandlordContact}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-6 rounded-xl border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Uploaded Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-slate-600/50 to-slate-500/50 p-4 rounded-xl border border-slate-500/30 hover:border-slate-400/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">Government ID</h4>
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <a 
                      href={application.identificationDocument} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 text-sm font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Document
                    </a>
                  </div>
                  
                  <div className="bg-gradient-to-br from-slate-600/50 to-slate-500/50 p-4 rounded-xl border border-slate-500/30 hover:border-slate-400/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">Employment Proof</h4>
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                      </div>
                    </div>
                    <a 
                      href={application.proofOfIncome} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-sm font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Document
                    </a>
                  </div>
                  
                  {application.rentalHistory && (
                    <div className="bg-gradient-to-br from-slate-600/50 to-slate-500/50 p-4 rounded-xl border border-slate-500/30 hover:border-slate-400/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">Rental History</h4>
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      </div>
                      <a 
                        href={application.rentalHistory} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 text-sm font-medium"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Document
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {application.notes && (
              <div className="mt-8">
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-6 rounded-xl border border-slate-600/30">
                  <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Additional Notes</h3>
                  <p className="text-gray-300 bg-slate-600/30 p-4 rounded-lg border border-slate-500/30">{application.notes}</p>
                </div>
              </div>
            )}
            
            {application.status === 'rejected' && application.rejectionReason && (
              <div className="mt-8">
                <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 p-6 rounded-xl border border-red-500/30">
                  <h3 className="text-lg font-semibold text-red-300 mb-4">Reason for Rejection</h3>
                  <p className="text-red-200 bg-red-500/10 p-4 rounded-lg border border-red-500/20">{application.rejectionReason}</p>
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-600/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Submitted on {new Date(application.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {application.status === 'pending' && (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleStatusChange('approved')}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </button>
                    <button
                      onClick={handleReject}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}