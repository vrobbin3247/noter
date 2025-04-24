import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white py-6 px-6 mb-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left - App Name */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="text-5xl font-bold text-orange-300"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Mura
          </Link>
        </div>
        
        {/* Middle - Search Field */}
        <div className="flex-1 max-w-2xl mx-6"> {/* Changed from max-w-md to max-w-2xl */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5"
              fill="none"
              stroke="#88ccf1" 
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        {/* Right - User Profile */}
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}