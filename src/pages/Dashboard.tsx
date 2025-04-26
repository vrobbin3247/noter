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

  useEffect(() => {
    const fetchThoughts = async () => {
      const { data, error } = await supabase
        .from('thoughts')
        .select(`
          *,
          profiles (username)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching thoughts:', error.message);
        return;
      }

      console.log('Fetched thoughts:', data); // Add this to verify data structure
      setThoughts(data || []);
    };

    fetchThoughts();
  }, []);

  const breakpointColumnsObj = {
    default: 5,
    1280: 4,
    1024: 3,
    768: 2,
    640: 1
  };

  return (
    <div className="flex-1 mx-auto px-24 overflow-y-auto">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-4"
        columnClassName="ml-4 bg-clip-padding"
      >
        {thoughts.map((thought) => {
          console.log('Thought data:', thought); // Add this to debug
          return (
            <div 
              key={thought.id} 
              className="mb-4 transition-transform duration-300 hover:scale-[1.02]"
              style={{ transition: 'transform 0.3s ease' }}
            >
              <ThoughtCard
                content={thought.content}
                color={thought.color}
                font={thought.font}
                createdAt={thought.created_at}
                author={thought.profiles} // Pass the entire profiles object
              />
            </div>
          );
        })}
      </Masonry>
    </div>
  );
};

export default Dashboard;