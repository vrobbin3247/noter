import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Masonry from 'react-masonry-css'
import ThoughtCard from '../components/ThoughtCard';
import PostThoughtForm from '../components/PostThoughtForm'; 
import axios from 'axios';

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
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const pageSize = 12; // how many thoughts per page

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
  
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user logged in');
      setLoading(false);
      return;
    }
  
    try {
      console.log('Saving thought...');
      
      // 1. Insert the Thought first
      const { data: insertedThoughts, error: thoughtError } = await supabase
        .from('thoughts')
        .insert([
          {
            content: newThought.trim(),
            color: selectedColor,
            font: selectedFont,
            user_id: user.id,
            created_at: new Date().toISOString()
          }
        ])
        .select();
  
      if (thoughtError || !insertedThoughts || insertedThoughts.length === 0) {
        console.error('Error saving thought:', thoughtError?.message);
        setLoading(false);
        return;
      }
  
      const thoughtId = insertedThoughts[0].id;
      console.log('Successfully created thought with ID:', thoughtId);
  
      // 2. Call DeepSeek API to get Tags
      console.log('Fetching tags from API...');
      const response = await axios.post(
        '/api/deepseek', // Use relative path in both environments
        {
          text: newThought.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const tags = response.data?.tags || [];
      console.log('Tags received from API:', tags);
      
      // 3. Process tags only if we got some back
      if (tags.length > 0) {
        console.log('Processing tags:', tags);
        for (const tagName of tags) {
          try {
            const normalizedTag = tagName.toLowerCase().trim();
            console.log('Processing tag:', normalizedTag);
        
            // Check if tag exists
            const { data: existingTag, error: fetchError } = await supabase
              .from('tags')
              .select('id')
              .eq('name', normalizedTag)
              .maybeSingle();
        
            if (fetchError) {
              console.error('Error fetching tag:', fetchError.message);
              continue;
            }
        
            let tagId;
            
            // Insert new tag if needed
            if (existingTag) {
              tagId = existingTag.id;
              console.log('Found existing tag with ID:', tagId);
            } else {
              const { data: newTag, error: insertError } = await supabase
                .from('tags')
                .insert([{ name: normalizedTag }])
                .select()
                .single();
        
              if (insertError) {
                console.error('Error inserting new tag:', insertError.message);
                continue;
              }
        
              tagId = newTag?.id;
              console.log('Created new tag with ID:', tagId);
            }
        
            // Insert relationship in thought_tags
            if (tagId) {
              console.log('Linking thought', thoughtId, 'with tag', tagId);
              const { data: thoughtTagData, error: thoughtTagError } = await supabase
                .from('thought_tags')
                .insert([{ 
                  thought_id: thoughtId, 
                  tag_id: tagId 
                }]);
        
              if (thoughtTagError) {
                console.error('Error linking thought to tag:', thoughtTagError.message);
                // Log the specific error details for debugging
                console.error('Attempted to link thought ID:', thoughtId, 'with tag ID:', tagId);
                console.error('Error details:', thoughtTagError);
              } else {
                console.log('Successfully linked thought to tag:', normalizedTag);
              }
            }
        
          } catch (tagError) {
            console.error('Error processing tag:', tagName, tagError);
          }
        }
      } else {
        console.log('No tags were returned from the API');
      }
  
      console.log('Thought saved successfully!');
      
    } catch (apiError) {
      console.error('Error in thought saving process:', apiError);
    } finally {
      // Reset UI regardless of errors
      setNewThought('');
      setSelectedColor('bg-[#f7f3e8]');
      setSelectedFont('font-serif');
      setPage(0);
      setLoading(false);
      
      // Refresh thoughts
      const { data } = await supabase
        .from('thoughts')
        .select(`*, profiles (username)`)
        .order('created_at', { ascending: false })
        .range(0, pageSize - 1);
      setThoughts(data || []);
    }
  };

  return (
    <div className="flex-1 mx-auto px-8 overflow-y-auto py-8">
      
      {/* Two-column layout */}
      <div className="flex gap-8">
        
      

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

        {/* Left - Post a Thought */}
        <PostThoughtForm
          newThought={newThought}
          setNewThought={setNewThought}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          handleSaveThought={handleSaveThought}
          fontDropdownOpen={fontDropdownOpen}
          setFontDropdownOpen={setFontDropdownOpen}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Dashboard;