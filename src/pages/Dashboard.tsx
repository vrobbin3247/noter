import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Masonry from 'react-masonry-css'
import ThoughtCard from '../components/ThoughtCard';

type Thought = {
  id: string;
  content: string;
  color: string;
  font: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
  };
};

const Dashboard = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [newThought, setNewThought] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-[#f7f3e8]');
  const [selectedFont, setSelectedFont] = useState('font-serif');
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);

  const [page, setPage] = useState(0);
  const pageSize = 10; // how many thoughts per page

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (fontDropdownOpen && !target.closest('.font-dropdown-container')) {
        setFontDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fontDropdownOpen]);

  useEffect(() => {
    const fetchThoughts = async () => {
      const from = page * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from('thoughts')
        .select(`*, profiles (username)`)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching thoughts:', error.message);
        return;
      }
      setThoughts(data || []);
    };

    fetchThoughts();
  }, [page]);

  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    1024: 2,
    768: 1,
  };

  const handlePrevious = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (thoughts.length === pageSize) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSaveThought = async () => {
    if (!newThought.trim()) {
      console.warn('Empty thought. Not saving.');
      return;
    }
  
    // Optionally: Check for a logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user logged in');
      return;
    }
  
    const { error } = await supabase
      .from('thoughts')
      .insert([
        {
          content: newThought.trim(),
          color: selectedColor,
          font: selectedFont,
          user_id: user.id,
        }
      ]);
  
    if (error) {
      console.error('Error saving thought:', error.message);
      return;
    }
  
    // Reset inputs after successful save
    setNewThought('');
    setSelectedColor('bg-[#f7f3e8]');
    setSelectedFont('font-serif');
  
    // Re-fetch thoughts
    setPage(0); // go back to first page to see new post
  };

  return (
    <div className="flex-1 mx-auto px-8 overflow-y-auto py-8">
      
      {/* Two-column layout */}
      <div className="flex gap-8">
        
      {/* Left - Post a Thought */}
<div className="w-[350px] flex-shrink-0 p-6 rounded-lg border-t border-l border-r border-gray-200 bg-[#fffdf9] shadow-sm h-fit">
  <h2 className="text-xl font-serif mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
    <span className="text-gray-600">✎</span> New Thought
  </h2>
  <textarea
    value={newThought}
    onChange={(e) => setNewThought(e.target.value)}
    placeholder="Write your thought here..."
    className="w-full h-40 p-4 bg-[#fffdf9] resize-none focus:outline-none mb-4 font-serif text-gray-700 border-b border-dashed border-gray-200 leading-relaxed"
    style={{
      backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e7e5e4 31px, #e7e5e4 32px)",
      lineHeight: "32px",
      paddingTop: "8px"
    }}
  />

  {/* Paper Style */}
  <div className="mb-4">
    <label className="block mb-2 font-serif text-sm text-gray-600">Paper Texture</label>
    <div className="flex gap-2">
      {[
        'bg-[#f7f3e8]',
        'bg-[#efe1c7]',
        'bg-[#f8f1e3]',
        'bg-[#f0ebe3]'
      ].map((color) => (
        <button
          key={color}
          onClick={() => setSelectedColor(color)}
          className={`w-8 h-8 rounded-sm border border-gray-200 ${color} ${
            selectedColor === color ? 'ring-1 ring-gray-400' : ''
          } hover:scale-105 transition-transform`}
        />
      ))}
    </div>
  </div>

{/* Font Style - Custom Dropdown */}
<div className="mb-6 font-dropdown-container">
  <label className="block mb-2 font-serif text-sm text-gray-600">Handwriting Style</label>
  <div className="relative">
    <div 
      className="w-full py-2 px-3 border-b border-gray-200 bg-transparent font-serif text-gray-700 flex justify-between items-center cursor-pointer"
      onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
    >
      <span>{selectedFont === 'font-serif' ? 'Serif' : 
             selectedFont === 'font-sans' ? 'Sans' : 'Mono'}</span>
      <svg className={`w-4 h-4 text-gray-400 transition-transform ${fontDropdownOpen ? 'transform rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
    
    {fontDropdownOpen && (
      <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 shadow-sm z-10">
        {[
          { value: 'font-serif', label: 'Serif' },
          { value: 'font-sans', label: 'Sans' },
          { value: 'font-mono', label: 'Mono' }
        ].map((font) => (
          <div
            key={font.value}
            className={`py-2 px-3 cursor-pointer hover:bg-gray-50 ${
              selectedFont === font.value ? 'bg-gray-50' : ''
            } ${font.value}`}
            onClick={() => {
              setSelectedFont(font.value);
              setFontDropdownOpen(false);
            }}
          >
            {font.label}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  {/* Post Button */}
  <button
  onClick={handleSaveThought}
   className="w-full py-2 border border-gray-300 rounded-sm bg-[#fdfdfa] text-gray-700 font-serif hover:bg-gray-50 transition-colors shadow-sm">
    Save Thought
  </button>
</div>

        {/* Right - Public Thoughts */}
        <div className="flex-1">
          {/* <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            🔥 Public Thoughts
          </h2> */}
          
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto -ml-4"
            columnClassName="ml-4 bg-clip-padding"
          >
            {thoughts.map((thought) => (
              <div 
                key={thought.id} 
                className="mb-4 transition-transform duration-300 hover:scale-[1.02]"
              >
                <ThoughtCard
                  content={thought.content}
                  color={thought.color}
                  font={thought.font}
                  createdAt={thought.created_at}
                  author={thought.profiles}
                />
              </div>
            ))}
          </Masonry>

          {/* Notebook-style Pagination */}
          <div className="flex justify-center mt-8 mb-2">
            <div className="inline-flex items-center border-t border-b border-gray-300 px-2 py-1">
              <button
                onClick={handlePrevious}
                disabled={page === 0}
                className="flex items-center justify-center px-3 py-1 text-gray-600 hover:text-black disabled:text-gray-300 transition-colors focus:outline-none"
                aria-label="Previous page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              
              <div className="flex items-center px-2 font-serif text-sm">
                <span>Page {page + 1}</span>
              </div>
              
              <button
                onClick={handleNext}
                disabled={thoughts.length < pageSize}
                className="flex items-center justify-center px-3 py-1 text-gray-600 hover:text-black disabled:text-gray-300 transition-colors focus:outline-none"
                aria-label="Next page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;