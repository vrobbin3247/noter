import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Masonry from 'react-masonry-css'
import ThoughtCard from '../components/ThoughtCard';

type Thought = {
  id: string;
  content: string;
  color: string;
  font: string;
  created_at: string;
};

const Dashboard = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
//   const navigate = useNavigate();

  useEffect(() => {
    const fetchThoughts = async () => {
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching thoughts:', error.message);
        return;
      }

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
    <div className="flex-1 mx-auto max-w-7xl"> {/* Added max-w-7xl to match header */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto"
        columnClassName="bg-clip-padding"
      >
        {thoughts.map((thought) => (
          <div key={thought.id} className="mb-4 mx-2">
            <ThoughtCard
              content={thought.content}
              color={thought.color}
              font={thought.font}
              createdAt={thought.created_at}
            />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default Dashboard;