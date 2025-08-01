'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages = {
    default: 'An error occurred during authentication.',
    configuration: 'There is a problem with the server configuration.',
    accessdenied: 'You do not have permission to sign in.',
    verification: 'The verification link may have been used or is invalid.',
    signin: 'Try signing in with a different account.',
    oauthsignin: 'Try signing in with a different account.',
    oauthcallback: 'Try signing in with a different account.',
    oauthcreateaccount: 'Try signing in with a different account.',
    emailcreateaccount: 'Try signing in with a different account.',
    callback: 'Try signing in with a different account.',
    oauthaccountnotlinked: 'To confirm your identity, sign in with the same account you used originally.',
    emailsignin: 'The e-mail could not be sent.',
    credentialssignin: 'Sign in failed. Check the details you provided are correct.',
    sessionrequired: 'Please sign in to access this page.',
  };

  const errorMessage = errorMessages[error] || errorMessages.default;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-6 text-red-600">Authentication Error</h1>
          
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            {errorMessage}
          </div>
          
          <div className="flex flex-col gap-4">
            <Link 
              href="/auth/signin"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </Link>
            
            <Link 
              href="/"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}