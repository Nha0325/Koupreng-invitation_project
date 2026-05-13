import { useState, useEffect } from 'react';

const PreviewPanel = ({ stageRef, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [viewMode, setViewMode] = useState('desktop');
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (stageRef?.current) {
      const url = stageRef.current.toDataURL({ pixelRatio: 2 });
      setPreviewUrl(url);
    }
  }, [stageRef]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Preview</h3>
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  viewMode === 'mobile' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
                }`}
              >
                Mobile
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  viewMode === 'desktop' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
                }`}
              >
                Desktop
              </button>
            </div>

            {/* Zoom Slider */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{zoom}%</span>
              <input
                type="range"
                min={50}
                max={150}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-24 accent-[#c8a96e]"
              />
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50 flex items-center justify-center">
          {previewUrl ? (
            <div
              className={`transition-all ${
                viewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-[600px]'
              }`}
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
            >
              {viewMode === 'mobile' && (
                <div className="bg-gray-900 rounded-[2rem] p-3 shadow-2xl">
                  <div className="bg-black rounded-[1.5rem] overflow-hidden">
                    <div className="h-6 bg-black flex items-center justify-center">
                      <div className="w-20 h-4 bg-gray-800 rounded-full" />
                    </div>
                    <img src={previewUrl} alt="Preview" className="w-full" />
                  </div>
                </div>
              )}
              {viewMode === 'desktop' && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full shadow-2xl rounded-lg"
                />
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Generating preview...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
