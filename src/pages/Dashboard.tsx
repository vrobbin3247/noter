import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">🧠 Thoughts Feed</h1>
      <div className="flex overflow-x-auto gap-4 pb-4">
        {thoughts.map((thought) => (
          <div key={thought.id} className="flex-shrink-0 w-64">
            <ThoughtCard
              content={thought.content}
              color={thought.color}
              font={thought.font}
              createdAt={thought.created_at}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;