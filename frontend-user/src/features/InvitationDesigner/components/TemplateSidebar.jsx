import { useState, useRef } from 'react';

const textBlocks = [
  { label: 'Bride & Groom Names', labelKh: 'ឈ្មោះគូស្មន', text: 'Bride & Groom', fontSize: 42, fontFamily: 'DM Sans', bold: true },
  { label: 'Event Title', labelKh: 'ចំណងជើង', text: 'Wedding Invitation', fontSize: 28, fontFamily: 'Georgia', bold: false },
  { label: 'Date & Time', labelKh: 'កាលបរិច្ឆេទ', text: 'January 15, 2026 | 5:00 PM', fontSize: 18, fontFamily: 'DM Sans', bold: false },
  { label: 'Venue', labelKh: 'ទីកន្លែង', text: 'Grand Palace Hotel', fontSize: 18, fontFamily: 'DM Sans', bold: false },
  { label: 'Invitation Message', labelKh: 'សារអញ្ជើញ', text: 'You are cordially invited to celebrate our special day', fontSize: 16, fontFamily: 'DM Sans', bold: false },
  { label: 'Contact Info', labelKh: 'ទំនាក់ទំនង', text: 'Contact: 012 345 678', fontSize: 14, fontFamily: 'DM Sans', bold: false },
  { label: 'RSVP', labelKh: 'ការឆ្លើយតប', text: 'RSVP by January 1, 2026', fontSize: 14, fontFamily: 'Montserrat', bold: true },
];

const decorativeElements = [
  { label: 'Horizontal Line', type: 'text', text: '____________________', fontSize: 24 },
  { label: 'Dots Divider', type: 'text', text: '• • • • • • •', fontSize: 18 },
  { label: 'Star Divider', type: 'text', text: '✦  ✦  ✦', fontSize: 20 },
  { label: 'Flourish', type: 'text', text: '~ ~ ~', fontSize: 24 },
];

const TemplateSidebar = ({ onAddElement }) => {
  const [textOpen, setTextOpen] = useState(true);
  const [decoOpen, setDecoOpen] = useState(false);
  const idCounter = useRef(0);

  const getNextId = (prefix) => {
    idCounter.current += 1;
    return `${prefix}-${idCounter.current}`;
  };

  const handleAddTextBlock = (block) => {
    const newElement = {
      id: getNextId('text'),
      type: 'text',
      text: block.text,
      x: 150,
      y: 400,
      fontSize: block.fontSize,
      fontFamily: block.fontFamily || 'DM Sans',
      fill: '#333333',
      width: 300,
      align: 'center',
      bold: block.bold || false,
      italic: false,
      opacity: 1,
    };
    onAddElement(newElement);
  };

  const handleAddDecorative = (deco) => {
    const newElement = {
      id: getNextId('deco'),
      type: 'text',
      text: deco.text,
      x: 200,
      y: 400,
      fontSize: deco.fontSize,
      fontFamily: 'DM Sans',
      fill: '#c8a96e',
      width: 200,
      align: 'center',
      bold: false,
      italic: false,
      opacity: 1,
    };
    onAddElement(newElement);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-full">
      {/* Text Blocks Section */}
      <div>
        <button
          onClick={() => setTextOpen(!textOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Text Blocks</h3>
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`transition-transform ${textOpen ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {textOpen && (
          <div className="mt-3 space-y-2">
            {textBlocks.map((block) => (
              <button
                key={block.label}
                onClick={() => handleAddTextBlock(block)}
                className="w-full text-left px-3 py-2.5 rounded-lg border border-gray-100 hover:border-[#c8a96e] hover:bg-[#c8a96e]/5 transition-colors group"
              >
                <span className="text-sm text-gray-700 group-hover:text-[#c8a96e]">{block.label}</span>
                <span className="block text-xs text-gray-400">{block.labelKh}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Decorative Elements Section */}
      <div>
        <button
          onClick={() => setDecoOpen(!decoOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Decorations</h3>
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`transition-transform ${decoOpen ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {decoOpen && (
          <div className="mt-3 space-y-2">
            {decorativeElements.map((deco) => (
              <button
                key={deco.label}
                onClick={() => handleAddDecorative(deco)}
                className="w-full text-left px-3 py-2.5 rounded-lg border border-gray-100 hover:border-[#c8a96e] hover:bg-[#c8a96e]/5 transition-colors group"
              >
                <span className="text-sm text-gray-700 group-hover:text-[#c8a96e]">{deco.label}</span>
                <span className="block text-xs text-gray-400 mt-0.5">{deco.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSidebar;
