'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function ApplicationStatus() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (sessionStatus === 'authenticated' && session?.user?.id) {
      fetchApplicationStatus();
    }
  }, [sessionStatus, session, router]);

  const fetchApplicationStatus = async () => {
    try {
      setError(null);
      console.log('Session user:', session.user);
      console.log('User ID:', session.user.id);

      if (!session.user.id) {
        throw new Error('User ID not available');
      }

      const response = await fetch(`/api/tenant-verification?userId=${session.user.id}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response:', data);
      setApplication(data.application);
    } catch (error) {
      console.error('Error fetching application status:', error);
      setError(error.message);
    } finally {
      setLoading(false);
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-600/30">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Application Status
            </h1>

            {error && (
              <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">Error loading application status</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
                <button
                  onClick={fetchApplicationStatus}
                  className="mt-3 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 text-sm"
                >
                  Retry
                </button>
              </div>
            )}

            {!application && !error ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-600/50 to-slate-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-4">No Application Found</h2>
                <p className="text-gray-300 mb-8">You haven't submitted a tenant verification application yet.</p>
                <div className="space-y-4">
                  <button
                    onClick={() => router.push('/dashboard/apply')}
                    className="group relative px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02] transform"
                  >
                    <span className="relative z-10">Apply Now</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            ) : application ? (
              <div className="space-y-8">
                <div className="flex items-center justify-between pb-6 border-b border-slate-600/30">
                  <h2 className="text-2xl font-semibold text-white">Application #{application._id.substring(0, 8)}</h2>
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-300">Status:</span>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      application.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      application.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-6 rounded-xl border border-slate-600/30">
                    <h3 className="font-semibold text-white mb-4 text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white font-medium">{application.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white font-medium">{application.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white font-medium">{application.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Address:</span>
                        <span className="text-white font-medium">{application.currentAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-6 rounded-xl border border-slate-600/30">
                    <h3 className="font-semibold text-white mb-4 text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Employment Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-white font-medium">{application.employmentStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Income:</span>
                        <span className="text-white font-medium">${application.income}/month</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-6 text-lg bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Uploaded Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {application.identificationDocument && (
                      <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-6 rounded-xl border border-slate-600/30">
                        <h4 className="font-medium text-white mb-4">Government ID Proof</h4>
                        <div className="space-y-3">
                          {application.identificationDocument.startsWith('http') ? (
                            <div>
                              <img
                                src={application.identificationDocument}
                                alt="Government ID Proof"
                                className="w-full h-48 object-cover rounded-lg border border-slate-600/30"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <div className="hidden">
                                <a
                                  href={application.identificationDocument}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyan-400 hover:text-cyan-300 underline flex items-center transition-colors duration-300"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  View Document
                                </a>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-300">Document uploaded</p>
                          )}
                        </div>
                      </div>
                    )}

                    {application.proofOfIncome && (
                      <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-6 rounded-xl border border-slate-600/30">
                        <h4 className="font-medium text-white mb-4">Employment Proof</h4>
                        <div className="space-y-3">
                          {application.proofOfIncome.startsWith('http') ? (
                            <div>
                              <img
                                src={application.proofOfIncome}
                                alt="Employment Proof"
                                className="w-full h-48 object-cover rounded-lg border border-slate-600/30"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <div className="hidden">
                                <a
                                  href={application.proofOfIncome}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyan-400 hover:text-cyan-300 underline flex items-center transition-colors duration-300"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  View Document
                                </a>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-300">Document uploaded</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fallback for documents that don't have URLs */}
                  {(!application.identificationDocument && !application.proofOfIncome) && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No documents uploaded</p>
                    </div>
                  )}
                </div>

                {application.notes && (
                  <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-6 rounded-xl border border-slate-600/30">
                    <h3 className="font-semibold text-white mb-4 text-lg bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Additional Notes
                    </h3>
                    <p className="text-gray-300">{application.notes}</p>
                  </div>
                )}

                {application.status === 'rejected' && application.rejectionReason && (
                  <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 p-6 rounded-xl backdrop-blur-sm">
                    <h3 className="font-semibold text-red-300 mb-3">Reason for Rejection</h3>
                    <p className="text-red-200">{application.rejectionReason}</p>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-600/30">
                  <p className="text-gray-400 text-sm font-medium">
                    Submitted on {new Date(application.createdAt).toLocaleDateString()} at {new Date(application.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
} 