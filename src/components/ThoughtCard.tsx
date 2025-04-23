import React from 'react';

type ThoughtCardProps = {
  content: string;
  color: string;
  font: string;
  createdAt: string;
};

const ThoughtCard: React.FC<ThoughtCardProps> = ({ content, color, font, createdAt }) => {
  return (
    <div
      className="rounded-xl p-4 shadow-md mb-4 text-black"
      style={{ backgroundColor: color, fontFamily: font }}
    >
      <p className="text-lg">{content}</p>
      <p className="text-xs mt-2 text-gray-700">Posted on {new Date(createdAt).toLocaleString()}</p>
    </div>
  );
};

export default ThoughtCard;