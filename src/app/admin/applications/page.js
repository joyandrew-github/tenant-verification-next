'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function AdminApplications() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const fetchApplications = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/applications');
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const data = await response.json();
      setApplications(data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

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
      
      fetchApplications();
    }
  }, [sessionStatus, session, router, fetchApplications]);
  
  const handleStatusChange = useCallback(async (applicationId, newStatus, rejectionReason = '') => {
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
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
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId 
            ? { ...app, status: newStatus, rejectionReason } 
            : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update status. Please try again.');
    }
  }, []);
  
  const handleReject = useCallback((applicationId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason !== null) {
      handleStatusChange(applicationId, 'rejected', reason);
    }
  }, [handleStatusChange]);
  
  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Tenant Applications</h1>
            <p className="text-gray-300 text-lg">Manage and review tenant verification applications</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-600/30 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
              <div className="flex-1">
                <label className="block text-gray-300 font-medium mb-2">Search Applications</label>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-700/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                />
              </div>
              
              <div className="w-full md:w-48">
                <label className="block text-gray-300 font-medium mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-700/50 text-white backdrop-blur-sm transition-all duration-300"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-600/50 to-slate-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-4">No Applications Found</h2>
                <p className="text-gray-400">No applications match your current search criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-600/30">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gradient-to-r from-slate-700/50 to-slate-600/50">Applicant</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gradient-to-r from-slate-700/50 to-slate-600/50">Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gradient-to-r from-slate-700/50 to-slate-600/50">Employment</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gradient-to-r from-slate-700/50 to-slate-600/50">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gradient-to-r from-slate-700/50 to-slate-600/50">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gradient-to-r from-slate-700/50 to-slate-600/50">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-600/30">
                    {filteredApplications.map((app, index) => (
                      <tr key={app._id} className={`hover:bg-slate-700/30 transition-all duration-300 ${index % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-700/20'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-600/50 to-slate-500/50 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">{app.fullName?.charAt(0) || 'A'}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{app.fullName}</div>
                              <div className="text-xs text-gray-400">ID: {app._id.substring(0, 8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{app.email}</div>
                          <div className="text-sm text-gray-400">{app.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{app.employmentStatus}</div>
                          <div className="text-sm text-cyan-400 font-medium">${app.income}/month</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={
                            `px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                              app.status === 'approved' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                              app.status === 'rejected' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                              'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            }`
                          }>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => router.push(`/admin/applications/${app._id}`)}
                              className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 text-xs font-medium"
                            >
                              View
                            </button>
                            
                            {app.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(app._id, 'approved')}
                                  className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-xs font-medium"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(app._id)}
                                  className="px-3 py-1 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 text-xs font-medium"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}