'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function AdminDashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalUsers: 0,
    thisMonthApplications: 0,
    averageProcessingTime: 0,
    approvalRate: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
      
      fetchStats();
    }
  }, [sessionStatus, session, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentApplications = async () => {
    try {
      const response = await fetch('/api/admin/recent-applications');
      if (response.ok) {
        const data = await response.json();
        setRecentApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching recent applications:', error);
    }
  };

  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user?.role === 'admin') {
      fetchStats();
      fetchRecentApplications();
    }
  }, [sessionStatus, session]);

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
             <div className="flex items-center justify-between">
               <div>
                 <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Admin Dashboard</h1>
                 <p className="text-gray-300 text-lg">Welcome back, {session?.user?.name}</p>
               </div>
               <div className="flex items-center gap-4">
                 <div className="text-right">
                   <p className="text-sm text-gray-400">Last Updated</p>
                   <p className="text-white font-medium">{new Date().toLocaleTimeString()}</p>
                 </div>
                 <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
               </div>
             </div>
           </div>

           {/* Navigation Tabs */}
           <div className="mb-8">
             <div className="flex space-x-1 bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-2 rounded-xl border border-slate-600/30">
               <button
                 onClick={() => setActiveTab('overview')}
                 className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                   activeTab === 'overview'
                     ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                     : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                 }`}
               >
                 Overview
               </button>
               <button
                 onClick={() => setActiveTab('analytics')}
                 className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                   activeTab === 'analytics'
                     ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                     : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                 }`}
               >
                 Analytics
               </button>
               <button
                 onClick={() => setActiveTab('management')}
                 className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                   activeTab === 'management'
                     ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                     : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                 }`}
               >
                 Management
               </button>
             </div>
           </div>

                     {/* Tab Content */}
           {activeTab === 'overview' && (
             <>
               {/* Stats Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                 <div className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-600/30 hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-[1.02] transform">
                   <div className="flex items-center">
                     <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                       </svg>
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-gray-400">Total Applications</p>
                       <p className="text-2xl font-semibold text-white">{stats.totalApplications}</p>
                     </div>
                   </div>
                 </div>

                 <div className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-600/30 hover:shadow-yellow-500/20 transition-all duration-500 hover:scale-[1.02] transform">
                   <div className="flex items-center">
                     <div className="p-3 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-gray-400">Pending</p>
                       <p className="text-2xl font-semibold text-white">{stats.pendingApplications}</p>
                     </div>
                   </div>
                 </div>

                 <div className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-600/30 hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.02] transform">
                   <div className="flex items-center">
                     <div className="p-3 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-gray-400">Approved</p>
                       <p className="text-2xl font-semibold text-white">{stats.approvedApplications}</p>
                     </div>
                   </div>
                 </div>

                 <div className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-600/30 hover:shadow-red-500/20 transition-all duration-500 hover:scale-[1.02] transform">
                   <div className="flex items-center">
                     <div className="p-3 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                       </svg>
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-gray-400">Rejected</p>
                       <p className="text-2xl font-semibold text-white">{stats.rejectedApplications}</p>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Additional Stats Row */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                 <div className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-600/30 hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] transform">
                   <div className="flex items-center">
                     <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                       </svg>
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-gray-400">Total Users</p>
                       <p className="text-2xl font-semibold text-white">{stats.totalUsers}</p>
                     </div>
                   </div>
                 </div>

                 <div className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-600/30 hover:shadow-indigo-500/20 transition-all duration-500 hover:scale-[1.02] transform">
                   <div className="flex items-center">
                     <div className="p-3 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 text-indigo-400 border border-indigo-500/30">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-gray-400">This Month</p>
                       <p className="text-2xl font-semibold text-white">{stats.thisMonthApplications}</p>
                     </div>
                   </div>
                 </div>

                 <div className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-600/30 hover:shadow-teal-500/20 transition-all duration-500 hover:scale-[1.02] transform">
                   <div className="flex items-center">
                     <div className="p-3 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 text-teal-400 border border-teal-500/30">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-gray-400">Avg. Processing</p>
                       <p className="text-2xl font-semibold text-white">{stats.averageProcessingTime}d</p>
                     </div>
                   </div>
                 </div>

                 <div className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-600/30 hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-[1.02] transform">
                   <div className="flex items-center">
                     <div className="p-3 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 text-emerald-400 border border-emerald-500/30">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                       </svg>
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-gray-400">Approval Rate</p>
                       <p className="text-2xl font-semibold text-white">{stats.approvalRate}%</p>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Recent Applications */}
               <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-600/30 mb-8">
                 <div className="flex items-center justify-between mb-6">
                   <h2 className="text-xl font-semibold text-white bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Recent Applications</h2>
                   <button
                     onClick={() => router.push('/admin/applications')}
                     className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 text-sm font-medium"
                   >
                     View All
                   </button>
                 </div>
                 <div className="space-y-4">
                   {recentApplications.length > 0 ? (
                     recentApplications.slice(0, 5).map((app, index) => (
                       <div key={app._id} className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/30 hover:bg-slate-600/50 transition-all duration-300">
                         <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 bg-gradient-to-br from-slate-600/50 to-slate-500/50 rounded-full flex items-center justify-center">
                             <span className="text-white font-medium">{app.fullName?.charAt(0) || 'A'}</span>
                           </div>
                           <div>
                             <p className="text-white font-medium">{app.fullName}</p>
                             <p className="text-gray-400 text-sm">{app.email}</p>
                           </div>
                         </div>
                         <div className="flex items-center space-x-4">
                           <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                             app.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                             app.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                             'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                           }`}>
                             {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                           </span>
                           <span className="text-gray-400 text-sm">{new Date(app.createdAt).toLocaleDateString()}</span>
                         </div>
                       </div>
                     ))
                   ) : (
                     <div className="text-center py-8">
                       <p className="text-gray-400">No recent applications</p>
                     </div>
                   )}
                 </div>
               </div>
             </>
           )}

           {activeTab === 'analytics' && (
             <div className="space-y-8">
               {/* Analytics Overview */}
               <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-600/30">
                 <h2 className="text-xl font-semibold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Analytics Overview</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="text-center p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/30">
                     <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                       <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                       </svg>
                     </div>
                     <h3 className="text-white font-semibold mb-2">Monthly Growth</h3>
                     <p className="text-3xl font-bold text-purple-400">+{stats.thisMonthApplications}</p>
                     <p className="text-gray-400 text-sm">New applications this month</p>
                   </div>
                   
                   <div className="text-center p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/30">
                     <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                       <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                       </svg>
                     </div>
                     <h3 className="text-white font-semibold mb-2">Success Rate</h3>
                     <p className="text-3xl font-bold text-green-400">{stats.approvalRate}%</p>
                     <p className="text-gray-400 text-sm">Applications approved</p>
                   </div>
                   
                   <div className="text-center p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/30">
                     <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                       <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                     </div>
                     <h3 className="text-white font-semibold mb-2">Processing Time</h3>
                     <p className="text-3xl font-bold text-cyan-400">{stats.averageProcessingTime}d</p>
                     <p className="text-gray-400 text-sm">Average days to process</p>
                   </div>
                 </div>
               </div>

               {/* Performance Metrics */}
               <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-600/30">
                 <h2 className="text-xl font-semibold text-white mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Performance Metrics</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/30">
                     <h3 className="text-white font-semibold mb-4">Application Status Distribution</h3>
                     <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <span className="text-gray-300">Pending</span>
                         <div className="flex items-center space-x-2">
                           <div className="w-32 bg-slate-600 rounded-full h-2">
                             <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${(stats.pendingApplications / stats.totalApplications) * 100}%` }}></div>
                           </div>
                           <span className="text-white font-medium">{stats.pendingApplications}</span>
                         </div>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-gray-300">Approved</span>
                         <div className="flex items-center space-x-2">
                           <div className="w-32 bg-slate-600 rounded-full h-2">
                             <div className="bg-green-400 h-2 rounded-full" style={{ width: `${(stats.approvedApplications / stats.totalApplications) * 100}%` }}></div>
                           </div>
                           <span className="text-white font-medium">{stats.approvedApplications}</span>
                         </div>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-gray-300">Rejected</span>
                         <div className="flex items-center space-x-2">
                           <div className="w-32 bg-slate-600 rounded-full h-2">
                             <div className="bg-red-400 h-2 rounded-full" style={{ width: `${(stats.rejectedApplications / stats.totalApplications) * 100}%` }}></div>
                           </div>
                           <span className="text-white font-medium">{stats.rejectedApplications}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/30">
                     <h3 className="text-white font-semibold mb-4">System Health</h3>
                     <div className="space-y-4">
                       <div className="flex items-center justify-between">
                         <span className="text-gray-300">Database Status</span>
                         <span className="text-green-400 font-medium">✓ Online</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-gray-300">API Response Time</span>
                         <span className="text-cyan-400 font-medium">~120ms</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-gray-300">Uptime</span>
                         <span className="text-green-400 font-medium">99.9%</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-gray-300">Active Sessions</span>
                         <span className="text-purple-400 font-medium">{stats.totalUsers}</span>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'management' && (
             <div className="space-y-8">
               {/* User Management */}
               <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-600/30">
                 <h2 className="text-xl font-semibold text-white mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">User Management</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <button className="group p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-slate-600/30 rounded-xl hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-300 hover:scale-[1.02] transform">
                     <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-[1.05] transition-transform duration-300">
                       <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                       </svg>
                     </div>
                     <h3 className="text-white font-semibold mb-2">Manage Users</h3>
                     <p className="text-gray-400 text-sm">View and manage user accounts</p>
                   </button>
                   
                   <button className="group p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-slate-600/30 rounded-xl hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-300 hover:scale-[1.02] transform">
                     <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-[1.05] transition-transform duration-300">
                       <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                       </svg>
                     </div>
                     <h3 className="text-white font-semibold mb-2">Role Management</h3>
                     <p className="text-gray-400 text-sm">Assign and manage user roles</p>
                   </button>
                   
                   <button className="group p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-slate-600/30 rounded-xl hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-300 hover:scale-[1.02] transform">
                     <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-[1.05] transition-transform duration-300">
                       <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                       </svg>
                     </div>
                     <h3 className="text-white font-semibold mb-2">System Alerts</h3>
                     <p className="text-gray-400 text-sm">Monitor system notifications</p>
                   </button>
                 </div>
               </div>

               {/* System Settings */}
               <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-600/30">
                 <h2 className="text-xl font-semibold text-white mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">System Settings</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/30">
                     <h3 className="text-white font-semibold mb-4">Application Settings</h3>
                     <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <span className="text-gray-300">Auto-approval threshold</span>
                         <span className="text-white font-medium">$5,000/month</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-gray-300">Max file size</span>
                         <span className="text-white font-medium">10MB</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-gray-300">Session timeout</span>
                         <span className="text-white font-medium">24 hours</span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/30">
                     <h3 className="text-white font-semibold mb-4">Notification Settings</h3>
                     <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <span className="text-gray-300">Email notifications</span>
                         <span className="text-green-400 font-medium">Enabled</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-gray-300">SMS alerts</span>
                         <span className="text-red-400 font-medium">Disabled</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-gray-300">Admin alerts</span>
                         <span className="text-green-400 font-medium">Enabled</span>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}

                     {/* Quick Actions - Only show in Overview tab */}
           {activeTab === 'overview' && (
             <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-600/30">
               <h2 className="text-xl font-semibold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Quick Actions</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <button
                   onClick={() => router.push('/admin/applications')}
                   className="group flex items-center p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-slate-600/30 rounded-xl hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-300 hover:scale-[1.02] transform hover:shadow-cyan-500/20"
                 >
                   <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 mr-4 group-hover:scale-[1.05] transition-transform duration-300">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                   </div>
                   <div className="text-left">
                     <h3 className="font-medium text-white">View All</h3>
                     <p className="text-sm text-gray-300">All applications</p>
                   </div>
                 </button>

                 <button
                   onClick={() => router.push('/admin/applications?status=pending')}
                   className="group flex items-center p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-slate-600/30 rounded-xl hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-300 hover:scale-[1.02] transform hover:shadow-yellow-500/20"
                 >
                   <div className="p-3 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30 mr-4 group-hover:scale-[1.05] transition-transform duration-300">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </div>
                   <div className="text-left">
                     <h3 className="font-medium text-white">Pending</h3>
                     <p className="text-sm text-gray-300">Awaiting review</p>
                   </div>
                 </button>

                 <button
                   onClick={() => router.push('/admin/applications?status=approved')}
                   className="group flex items-center p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-slate-600/30 rounded-xl hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-300 hover:scale-[1.02] transform hover:shadow-green-500/20"
                 >
                   <div className="p-3 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 mr-4 group-hover:scale-[1.05] transition-transform duration-300">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                   </div>
                   <div className="text-left">
                     <h3 className="font-medium text-white">Approved</h3>
                     <p className="text-sm text-gray-300">Successful applications</p>
                   </div>
                 </button>

                 <button
                   onClick={() => router.push('/admin/applications?status=rejected')}
                   className="group flex items-center p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-slate-600/30 rounded-xl hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-300 hover:scale-[1.02] transform hover:shadow-red-500/20"
                 >
                   <div className="p-3 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30 mr-4 group-hover:scale-[1.05] transition-transform duration-300">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </div>
                   <div className="text-left">
                     <h3 className="font-medium text-white">Rejected</h3>
                     <p className="text-sm text-gray-300">Declined applications</p>
                   </div>
                 </button>
               </div>
             </div>
           )}
        </div>
      </main>
    </div>
  );
} 