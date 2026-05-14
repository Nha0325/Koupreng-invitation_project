import { useState } from 'react';

const ThemePanel = ({ background, onBackgroundChange }) => {
  const [bgType, setBgType] = useState(background?.type || 'solid');
  const [solidColor, setSolidColor] = useState(background?.color || '#ffffff');
  const [gradColor1, setGradColor1] = useState(background?.color1 || '#000000');
  const [gradColor2, setGradColor2] = useState(background?.color2 || '#333333');
  const [gradDirection, setGradDirection] = useState(background?.direction || 'vertical');

  const applyBackground = (type, updates) => {
    if (type === 'solid') {
      const color = updates?.color || solidColor;
      setSolidColor(color);
      onBackgroundChange({ type: 'solid', color });
    } else {
      const c1 = updates?.color1 || gradColor1;
      const c2 = updates?.color2 || gradColor2;
      const dir = updates?.direction || gradDirection;
      setGradColor1(c1);
      setGradColor2(c2);
      setGradDirection(dir);
      onBackgroundChange({ type: 'gradient', color1: c1, color2: c2, direction: dir });
    }
  };

  const handleTypeChange = (type) => {
    setBgType(type);
    applyBackground(type);
  };

  const presetThemes = [
    { label: 'Light', bg: { type: 'solid', color: '#ffffff' } },
    { label: 'Dark', bg: { type: 'solid', color: '#1a1a2e' } },
    { label: 'Cream', bg: { type: 'solid', color: '#fdf6e3' } },
    { label: 'Royal', bg: { type: 'solid', color: '#8b0000' } },
    { label: 'Navy', bg: { type: 'solid', color: '#0f3460' } },
    { label: 'Sunset', bg: { type: 'gradient', color1: '#e94560', color2: '#f4c430', direction: 'vertical' } },
    { label: 'Ocean', bg: { type: 'gradient', color1: '#1a1a2e', color2: '#16213e', direction: 'vertical' } },
    { label: 'Forest', bg: { type: 'gradient', color1: '#1b4332', color2: '#2d6a4f', direction: 'vertical' } },
  ];

  return (
    <div className="p-4 space-y-5 overflow-y-auto max-h-full">
      <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Theme & Background</h3>

      {/* Quick Presets */}
      <div>
        <label className="block text-xs text-gray-500 mb-2">Quick Presets</label>
        <div className="grid grid-cols-4 gap-2">
          {presetThemes.map((theme) => (
            <button
              key={theme.label}
              onClick={() => {
                setBgType(theme.bg.type);
                if (theme.bg.type === 'solid') {
                  setSolidColor(theme.bg.color);
                } else {
                  setGradColor1(theme.bg.color1);
                  setGradColor2(theme.bg.color2);
                  setGradDirection(theme.bg.direction);
                }
                onBackgroundChange(theme.bg);
              }}
              className="flex flex-col items-center gap-1"
              title={theme.label}
            >
              <div
                className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm"
                style={{
                  background: theme.bg.type === 'solid'
                    ? theme.bg.color
                    : `linear-gradient(to bottom, ${theme.bg.color1}, ${theme.bg.color2})`,
                }}
              />
              <span className="text-[10px] text-gray-500">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Background Type Toggle */}
      <div>
        <label className="block text-xs text-gray-500 mb-2">Background Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleTypeChange('solid')}
            className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
              bgType === 'solid'
                ? 'bg-[#c8a96e] text-white border-[#c8a96e]'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Solid
          </button>
          <button
            onClick={() => handleTypeChange('gradient')}
            className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
              bgType === 'gradient'
                ? 'bg-[#c8a96e] text-white border-[#c8a96e]'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Gradient
          </button>
        </div>
      </div>

      {/* Solid Color */}
      {bgType === 'solid' && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Background Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={solidColor}
              onChange={(e) => applyBackground('solid', { color: e.target.value })}
              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={solidColor}
              onChange={(e) => applyBackground('solid', { color: e.target.value })}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c8a96e]"
            />
          </div>
        </div>
      )}

      {/* Gradient */}
      {bgType === 'gradient' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Direction</label>
            <select
              value={gradDirection}
              onChange={(e) => applyBackground('gradient', { direction: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c8a96e]"
            >
              <option value="vertical">Top to Bottom</option>
              <option value="horizontal">Left to Right</option>
              <option value="diagonal">Diagonal</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Color 1</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={gradColor1}
                onChange={(e) => applyBackground('gradient', { color1: e.target.value })}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={gradColor1}
                onChange={(e) => applyBackground('gradient', { color1: e.target.value })}
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c8a96e]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Color 2</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={gradColor2}
                onChange={(e) => applyBackground('gradient', { color2: e.target.value })}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={gradColor2}
                onChange={(e) => applyBackground('gradient', { color2: e.target.value })}
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c8a96e]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Dark/Light Toggle */}
      <div>
        <label className="block text-xs text-gray-500 mb-2">Quick Toggle</label>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setBgType('solid');
              setSolidColor('#ffffff');
              onBackgroundChange({ type: 'solid', color: '#ffffff' });
            }}
            className="flex-1 py-2 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Light Theme
          </button>
          <button
            onClick={() => {
              setBgType('solid');
              setSolidColor('#1a1a2e');
              onBackgroundChange({ type: 'solid', color: '#1a1a2e' });
            }}
            className="flex-1 py-2 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Dark Theme
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemePanel;
