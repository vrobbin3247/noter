
type ThoughtCardProps = {
  content: string;
  color: string;
  font: string;
  createdAt: string;
};

const ThoughtCard = ({ content, color, font, createdAt }: ThoughtCardProps) => {
    return (
      <div 
        className={`rounded-lg p-4 shadow-lg backdrop-blur-md bg-white/30 border border-white/20`}
        style={{
          fontFamily: font,
          minWidth: '200px',
          maxWidth: '270px',
          backgroundColor: `${color}80`, // Adds 50% opacity to the existing color
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <p className="text-lg mb-2 break-words">{content}</p>
        <p className="text-xs text-gray-600">{new Date(createdAt).toLocaleString()}</p>
      </div>
    );
  };

export default ThoughtCard;