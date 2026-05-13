const FONT_FAMILIES = [
  'Noto Sans Khmer',
  'DM Sans',
  'Montserrat',
  'Georgia',
  'Times New Roman',
];

const TextEditor = ({ element, onChange }) => {
  if (!element || element.type !== 'text') {
    return (
      <div className="p-4 text-center text-gray-400 text-sm">
        <p>Select a text element to edit its properties</p>
      </div>
    );
  }

  const update = (props) => {
    onChange(element.id, props);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-full">
      <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Text Properties</h3>

      {/* Text Content */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Content</label>
        <textarea
          value={element.text || ''}
          onChange={(e) => update({ text: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c8a96e] resize-none"
        />
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Font Family</label>
        <select
          value={element.fontFamily || 'DM Sans'}
          onChange={(e) => update({ fontFamily: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c8a96e]"
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Font Size</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => update({ fontSize: Math.max(10, (element.fontSize || 24) - 2) })}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            -
          </button>
          <input
            type="number"
            min={10}
            max={120}
            value={element.fontSize || 24}
            onChange={(e) => update({ fontSize: Math.min(120, Math.max(10, Number(e.target.value))) })}
            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:border-[#c8a96e]"
          />
          <button
            onClick={() => update({ fontSize: Math.min(120, (element.fontSize || 24) + 2) })}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.fill || '#000000'}
            onChange={(e) => update({ fill: e.target.value })}
            className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
          />
          <input
            type="text"
            value={element.fill || '#000000'}
            onChange={(e) => update({ fill: e.target.value })}
            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c8a96e]"
          />
        </div>
      </div>

      {/* Bold/Italic */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Style</label>
        <div className="flex gap-2">
          <button
            onClick={() => update({ bold: !element.bold })}
            className={`px-4 py-2 border rounded-lg text-sm font-bold transition-colors ${
              element.bold
                ? 'bg-[#c8a96e] text-white border-[#c8a96e]'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            B
          </button>
          <button
            onClick={() => update({ italic: !element.italic })}
            className={`px-4 py-2 border rounded-lg text-sm italic transition-colors ${
              element.italic
                ? 'bg-[#c8a96e] text-white border-[#c8a96e]'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            I
          </button>
        </div>
      </div>

      {/* Text Align */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Alignment</label>
        <div className="flex gap-2">
          {['left', 'center', 'right'].map((align) => (
            <button
              key={align}
              onClick={() => update({ align })}
              className={`flex-1 px-3 py-2 border rounded-lg text-xs transition-colors ${
                element.align === align
                  ? 'bg-[#c8a96e] text-white border-[#c8a96e]'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Opacity */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Opacity: {Math.round((element.opacity !== undefined ? element.opacity : 1) * 100)}%
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round((element.opacity !== undefined ? element.opacity : 1) * 100)}
          onChange={(e) => update({ opacity: Number(e.target.value) / 100 })}
          className="w-full accent-[#c8a96e]"
        />
      </div>
    </div>
  );
};

export default TextEditor;
