'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  // Debug logging
  if (session?.user) {
    console.log('Navbar - Session user data:', {
      name: session.user.name,
      image: session.user.image,
      role: session.user.role
    });
  }

  return (
    <nav className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 shadow-xl py-4 relative z-20">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 hover:scale-[1.02] transition-all duration-300">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7C15 8.65 13.65 10 12 10S9 8.65 9 7V5.5L3 7V9C3 10.65 4.35 12 6 12H8V20C8 21.1 8.9 22 10 22H14C15.1 22 16 21.1 16 20V12H18C19.65 12 21 10.65 21 9ZM19 15L17.5 16.5L19 18L22 15L19 12L17.5 13.5L19 15Z"/>
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-cyan-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300">
            Tenant Verification
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-8 w-24 bg-slate-600/50 animate-pulse rounded-lg"></div>
          ) : session ? (
            <div className="flex items-center gap-4">
              {session.user.role === 'admin' ? (
                <Link 
                  href="/admin" 
                  className="text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium hover:scale-[1.02] transform"
                >
                  Track Applications
                </Link>
              ) : (
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium hover:scale-[1.02] transform"
                >
                  Dashboard
                </Link>
              )}
                             <div className="flex items-center gap-3">
                 <div className="relative group">
                   {session.user.image && session.user.image !== '' ? (
                     <Image
                       src={session.user.image}
                       alt={session.user.name || 'Profile'}
                       width={40}
                       height={40}
                       className="rounded-full border-2 border-slate-600/50 group-hover:border-cyan-400/50 transition-all duration-300 shadow-lg object-cover"
                       onError={(e) => {
                         console.log('Image failed to load:', session.user.image);
                         e.target.style.display = 'none';
                         e.target.nextSibling.style.display = 'flex';
                       }}
                       onLoad={() => {
                         console.log('Image loaded successfully:', session.user.image);
                       }}
                     />
                   ) : null}
                   <div className={`w-10 h-10 bg-gradient-to-br from-slate-600/50 to-slate-500/50 rounded-full border-2 border-slate-600/50 flex items-center justify-center shadow-lg ${session.user.image && session.user.image !== '' ? 'hidden' : ''}`}>
                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                     </svg>
                   </div>
                   <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 </div>
                 <Link 
                   href="/profile" 
                   className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-all duration-300 cursor-pointer hover:scale-[1.02] transform"
                 >
                   {session.user.name}
                 </Link>
               </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-[1.02] transform font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="px-4 py-2 border-2 border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 font-medium hover:scale-[1.02] transform"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transform font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}