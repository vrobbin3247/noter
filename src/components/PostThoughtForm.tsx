import React from 'react';


type PostThoughtFormProps = {
  newThought: string;
  setNewThought: (value: string) => void;
  selectedColor: string;
  setSelectedColor: (value: string) => void;
  selectedFont: string;
  setSelectedFont: (value: string) => void;
  handleSaveThought: () => void;
  fontDropdownOpen: boolean;
  setFontDropdownOpen: (value: boolean) => void;
};

const PostThoughtForm: React.FC<PostThoughtFormProps> = ({
  newThought,
  setNewThought,
  selectedColor,
  setSelectedColor,
  selectedFont,
  setSelectedFont,
  handleSaveThought,
  fontDropdownOpen,
  setFontDropdownOpen,
}) => {
  return (
    <div className="w-[350px] flex-shrink-0 p-6 rounded-lg border border-gray-300 bg-[#fffdf9] h-fit">
      <h2 className="text-xl font-serif mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
        <span className="text-gray-600 transform scale-x-[-1]">✎</span> New Thought
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

      {/* Font Style Dropdown */}
      <div className="mb-6 font-dropdown-container">
        <label className="block mb-2 font-serif text-sm text-gray-600">Handwriting Style</label>
        <div className="relative">
          <div 
            className="w-full py-2 px-3 border-b border-gray-200 bg-transparent font-serif text-gray-700 flex justify-between items-center cursor-pointer"
            onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
          >
            <span>{selectedFont === 'font-serif' ? 'Serif' : selectedFont === 'font-sans' ? 'Sans' : 'Mono'}</span>
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
        className="w-full py-2 border border-gray-300 rounded-sm bg-[#fdfdfa] text-gray-700 font-serif hover:bg-gray-100 hover:border-black transition-colors shadow-sm"
      >
        Save Thought
      </button>
    </div>
  );
};

export default PostThoughtForm;