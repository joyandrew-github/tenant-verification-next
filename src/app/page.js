import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center relative z-10">
        <div className="mb-8 animate-pulse">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Tenant Verification
          </h1>
          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 bg-clip-text text-transparent">
            Platform
          </div>
        </div>
        
        <p className="text-xl text-gray-300 max-w-2xl mb-12 leading-relaxed">
          Streamline your tenant verification process with our 
          <span className="text-cyan-400 font-semibold"> secure</span> and 
          <span className="text-purple-400 font-semibold"> efficient</span> platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mb-16">
          <Link
            href="/auth/signup"
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transform"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <Link
            href="/about"
            className="group px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-xl hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-cyan-400/25 hover:scale-[1.02] transform"
          >
            Learn More
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          <div className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-purple-500/20 transition-all duration-500 border border-slate-600/30 hover:border-purple-500/50 hover:scale-[1.02] transform">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Secure Verification
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Our platform ensures all tenant information is securely stored and processed with enterprise-grade encryption.
            </p>
          </div>
          
          <div className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-cyan-500/20 transition-all duration-500 border border-slate-600/30 hover:border-cyan-500/50 hover:scale-[1.02] transform">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Lightning Fast
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Get verification results in minutes, not days, with our AI-powered streamlined processing system.
            </p>
          </div>
          
          <div className="group bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-yellow-500/20 transition-all duration-500 border border-slate-600/30 hover:border-yellow-500/50 hover:scale-[1.02] transform">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Smart Documents
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Intelligent document management with automated parsing and verification of all required files.
            </p>
          </div>
        </div>

        {/* Additional stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <div className="text-gray-400 text-sm">Verified Tenants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <div className="text-gray-400 text-sm">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-gray-400 text-sm">Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              5min
            </div>
            <div className="text-gray-400 text-sm">Average Process</div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm py-8 border-t border-slate-700/50 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} 
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold mx-2">
              Tenant Verification App
            </span>
            All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">Terms</a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-300">Contact</a>
          </div>
        </div>
      </footer>


    </div>
  );
}