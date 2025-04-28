import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PlusIcon, TagIcon, UserGroupIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

// Define proper TypeScript interfaces
interface Tag {
  id?: string;
  name: string;
  count: number;
}

interface Forum {
  id: number;
  name: string;
  unread: number;
}

// Fix: Update the ThoughtTag interface to match the actual structure


export default function HeaderExtensions() {
  const [showForumSwitcher, setShowForumSwitcher] = useState(false);
  const [showTagExplorer, setShowTagExplorer] = useState(false);
  const [showCreateForumModal, setShowCreateForumModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [trendingTags, setTrendingTags] = useState<Tag[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const forumSwitcherRef = useRef<HTMLDivElement>(null);
  const tagExplorerRef = useRef<HTMLDivElement>(null);
  
  const myForums: Forum[] = [
    { id: 1, name: 'Daily Reflections', unread: 3 },
    { id: 2, name: 'Product Design', unread: 0 },
    { id: 3, name: 'Book Club', unread: 7 },
    { id: 4, name: 'Future of AI', unread: 12 }
  ];

  useEffect(() => {
    const fetchTrendingTags = async () => {
        try {
          const { data: rpcData, error: rpcError } = await supabase
            .rpc('get_trending_tags', { 
              days: 7, 
              limit: 10 
            });
      
          if (!rpcError && rpcData) {
            setTrendingTags(rpcData as Tag[]);
            return;
          }
      
          // Fallback to direct query
          const { data: queryData, error: queryError } = await supabase
            .from('thought_tags')
            .select(`
              tags!inner(name),
              thoughts!inner(created_at)
            `)
            .gte('thoughts.created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .limit(50);
      
          if (queryError) throw queryError;
      
          const tagCounts: Record<string, number> = {};
          
          // Fix: Process each item individually
          if (queryData) {
            queryData.forEach((item: any) => {
              // Check if item.tags is an array and handle accordingly
              if (Array.isArray(item.tags)) {
                item.tags.forEach((tag: any) => {
                  if (tag && tag.name) {
                    tagCounts[tag.name] = (tagCounts[tag.name] || 0) + 1;
                  }
                });
              } else if (item.tags && item.tags.name) {
                // Handle case where tags is an object with name property
                tagCounts[item.tags.name] = (tagCounts[item.tags.name] || 0) + 1;
              }
            });
          }
      
          const sortedTags: Tag[] = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 15)
            .map(([name, count]) => ({ name, count }));
      
          setTrendingTags(sortedTags);
        } catch (error) {
          console.error('Error fetching trending tags:', error);
          setTrendingTags(popularTags.slice(0, 15));
        }
      };
      
      const fetchPopularTags = async () => {
        try {
          const { data, error } = await supabase
            .from('tags')
            .select(`
              id, name, 
              thought_tags(count)
            `)
            .order('count', { foreignTable: 'thought_tags', ascending: false })
            .limit(20);
      
          if (error) throw error;
      
          setPopularTags(
            data.map(tag => ({
              id: tag.id,
              name: tag.name,
              count: tag.thought_tags[0]?.count || 0
            }))
          );
        } catch (error) {
          console.error('Error fetching popular tags:', error);
        }
      };

    fetchTrendingTags();
    fetchPopularTags();

    const handleClickOutside = (event: MouseEvent) => {
      if (forumSwitcherRef.current && !forumSwitcherRef.current.contains(event.target as Node)) {
        setShowForumSwitcher(false);
      }
      if (tagExplorerRef.current && !tagExplorerRef.current.contains(event.target as Node)) {
        setShowTagExplorer(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTagSelection = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  return (
    <div className="w-full bg-[#F8F6F1] border-b border-[#E8E4DD] px-6 pb-2">
      {/* Combined Top Bar - Trending Tags + Tag Explorer */}
      <div className="w-full flex items-center justify-between py-2">
        {/* Trending Tags Bar (left) */}
        <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="text-[#A8A39B] text-xs font-medium whitespace-nowrap">Trending:</span>
          {trendingTags.map((tag: Tag) => (
            <Link 
              key={tag.name} 
              to={`/tags/${tag.name}`}
              className="text-sm text-[#6B6A68] hover:text-[#C9A889] bg-[#FDFCFA] hover:bg-[#F5F3EF] px-3
              py-1 rounded-full border border-[#E8E4DD] whitespace-nowrap transition-colors duration-200"
            >
              #{tag.name}
            </Link>
          ))}
        </div>

        {/* Tag Explorer (right) */}
        <div className="relative ml-4" ref={tagExplorerRef}>
          <button 
            onClick={() => setShowTagExplorer(!showTagExplorer)}
            className="flex items-center gap-2 text-[#6B6A68] hover:text-[#C9A889] transition-colors duration-200"
          >
            <TagIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Explore Tags</span>
            {selectedTags.length > 0 && (
              <span className="bg-[#C9A889] text-white text-xs px-2 py-0.5 rounded-full">
                {selectedTags.length}
              </span>
            )}
          </button>
          
          {showTagExplorer && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FDFCFA] rounded-md shadow-sm border border-[#E8E4DD] py-2 z-50">
              <div className="px-4 py-2">
                <h3 className="font-medium text-[#6B6A68] mb-2">Tag Combination</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTags.length > 0 ? (
                    selectedTags.map((tag, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-1 bg-[#F2EEE8] px-2 py-1 rounded-md text-xs text-[#6B6A68]"
                      >
                        #{tag}
                        <button 
                          onClick={() => toggleTagSelection(tag)}
                          className="text-[#A8A39B] hover:text-[#6B6A68]"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-[#A8A39B]">Select tags to combine</span>
                  )}
                </div>
                
                {selectedTags.length > 0 && (
                  <Link
                    to={`/search?tags=${selectedTags.join(',')}`}
                    className="block w-full text-center bg-[#C9A889] text-white text-sm py-1.5 rounded-md hover:bg-[#BF9E7E] transition-colors duration-200"
                  >
                    Search Combined Tags
                  </Link>
                )}
              </div>
              
              <div className="border-t border-[#E8E4DD] my-1"></div>
              
              <div className="px-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-[#6B6A68]">Popular Tags</h3>
                  <button className="text-xs text-[#A8A39B] hover:text-[#6B6A68]">
                    <AdjustmentsHorizontalIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {popularTags.map((tag: Tag) => (
                  <button
                    key={tag.name}
                    onClick={() => toggleTagSelection(tag.name)}
                    className={`text-xs px-2 py-1 rounded-full border transition-colors duration-200 ${
                      selectedTags.includes(tag.name)
                        ? 'bg-[#C9A889] text-white border-[#C9A889]'
                        : 'bg-[#FDFCFA] text-[#6B6A68] border-[#E8E4DD] hover:bg-[#F5F3EF]'
                    }`}
                  >
                    #{tag.name} <span className="text-xs opacity-70">({tag.count})</span>
                  </button>
                ))}
                </div>
              </div>
              
              <div className="border-t border-[#E8E4DD] my-1"></div>
              
              <Link
                to="/tags"
                className="block px-4 py-2 text-sm text-[#6B6A68] hover:bg-[#F5F3EF]"
              >
                View All Tags
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Forum Actions Bar */}
      <div className="flex items-center justify-between py-2">
        {/* Left - Forum Actions */}
        <div className="flex items-center gap-4">
          {/* Forum Switcher */}
          <div className="relative" ref={forumSwitcherRef}>
            <button 
              onClick={() => setShowForumSwitcher(!showForumSwitcher)}
              className="flex items-center gap-2 text-[#6B6A68] hover:text-[#C9A889] transition-colors duration-200"
            >
              <UserGroupIcon className="h-5 w-5" />
              <span className="text-sm font-medium">My Forums</span>
            </button>
            
            {showForumSwitcher && (
              <div className="absolute left-0 mt-2 w-64 bg-[#FDFCFA] rounded-md shadow-sm border border-[#E8E4DD] py-2 z-50">
                {myForums.map(forum => (
                  <Link
                    key={forum.id}
                    to={`/forums/${forum.id}`}
                    className="flex items-center justify-between px-4 py-2 text-sm text-[#6B6A68] hover:bg-[#F5F3EF]"
                  >
                    <span>{forum.name}</span>
                    {forum.unread > 0 && (
                      <span className="bg-[#C9A889] text-white text-xs px-2 py-0.5 rounded-full">
                        {forum.unread}
                      </span>
                    )}
                  </Link>
                ))}
                <div className="border-t border-[#E8E4DD] my-1"></div>
                <button
                  onClick={() => {
                    setShowForumSwitcher(false);
                    setShowCreateForumModal(true);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[#6B6A68] hover:bg-[#F5F3EF]"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Create New Forum</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Create Forum Button */}
          <button 
            onClick={() => setShowCreateForumModal(true)}
            className="flex items-center gap-1 text-[#6B6A68] hover:text-[#C9A889] transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="text-sm font-medium">New Forum</span>
          </button>
        </div>
      </div>
      
      {/* Create Forum Modal */}
      {showCreateForumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-[#FDFCFA] rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8E4DD]">
              <h2 className="text-lg font-medium text-[#6B6A68]">Create New Forum</h2>
            </div>
            
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#6B6A68] mb-1">Forum Name</label>
                <input
                  type="text"
                  className="w-full py-2 px-3 rounded-md border border-[#E2DED7] bg-[#FDFCFA] focus:outline-none focus:ring-1 focus:ring-[#D9C9B8] text-sm"
                  placeholder="Enter forum name..."
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#6B6A68] mb-1">Description</label>
                <textarea
                  className="w-full py-2 px-3 rounded-md border border-[#E2DED7] bg-[#FDFCFA] focus:outline-none focus:ring-1 focus:ring-[#D9C9B8] text-sm h-24"
                  placeholder="Enter forum description..."
                ></textarea>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center mb-1">
                  <label className="text-sm font-medium text-[#6B6A68]">Privacy</label>
                  <span className="ml-1 text-xs text-[#A8A39B]">(Who can see this forum?)</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-[#6B6A68]">
                    <input type="radio" name="privacy" className="text-[#C9A889]" defaultChecked />
                    <span>Public</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#6B6A68]">
                    <input type="radio" name="privacy" className="text-[#C9A889]" />
                    <span>Private</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-3 bg-[#F5F3EF] flex justify-end gap-2">
              <button 
                onClick={() => setShowCreateForumModal(false)}
                className="px-4 py-2 text-sm text-[#6B6A68] hover:bg-[#E8E4DD] rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 text-sm bg-[#C9A889] text-white rounded-md hover:bg-[#BF9E7E] transition-colors duration-200"
              >
                Create Forum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}