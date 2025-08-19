import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Are you lost? - CrowdProp",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Are you lost?</h1>
          <p className="text-gray-600 mb-8">
            Looks like you&apos;ve wandered off the beaten path. Don&apos;t worry, it happens to the best of us!
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Take me home
          </Link>
          
          <Link 
            href="/dashboard"
            className="inline-block w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-6 rounded-lg border-2 border-blue-600 transition duration-200"
          >
            Go to Dashboard
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>If you think this is a mistake, please contact our support team.</p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/6 w-8 h-8 bg-purple-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}
