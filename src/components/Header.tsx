import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Header() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setAvatarUrl(data.avatar_url);
        }
      }
    };

    fetchProfile();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header className="w-full bg-[#F8F6F1] border-b border-[#E8E4DD] pt-4 pb-3 px-8">
      <div className="w-full flex items-center justify-between">
        {/* Left - App Name */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="text-4xl font-medium text-[#C9A889]"
            style={{ fontFamily: "'Garamond', serif" }}
          >
            Mura
          </Link>
        </div>
        
        {/* Middle - Search Field */}
        <div className="flex-1 max-w-md mx-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full py-1.5 px-4 rounded-lg border border-[#E2DED7] bg-[#FDFCFA] focus:outline-none focus:ring-1 focus:ring-[#D9C9B8] text-sm placeholder-[#BBBBBB]"
            />
            <svg
              className="absolute right-3 top-2 h-4 w-4"
              fill="none"
              stroke="#C9C5BF"
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
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover border border-[#E8E4DD] hover:border-[#D9C9B8] transition-all"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#F2EEE8] flex items-center justify-center hover:bg-[#EBE7E0] transition-all">
                <svg
                  className="h-5 w-5 text-[#B4AFA8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-[#FDFCFA] rounded-md shadow-sm border border-[#E8E4DD] py-1 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-[#6B6A68] hover:bg-[#F5F3EF]"
              >
                Your Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-[#6B6A68] hover:bg-[#F5F3EF]"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}