import { useState, useRef } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ImageUploader = ({ onAddImage }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    setError('');

    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are supported.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const addToCanvas = () => {
    if (preview) {
      onAddImage(preview);
      setPreview(null);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Upload Image</h3>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-[#c8a96e] bg-[#c8a96e]/5'
            : 'border-gray-200 hover:border-[#c8a96e] hover:bg-gray-50'
        }`}
      >
        <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-gray-500 mb-1">Drag & drop an image here</p>
        <p className="text-xs text-gray-400">or click to browse</p>
        <p className="text-xs text-gray-400 mt-2">JPEG, PNG, WebP (max 5MB)</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* Preview */}
      {preview && (
        <div className="space-y-3">
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
          </div>
          <button
            onClick={addToCanvas}
            className="w-full py-2 bg-[#c8a96e] text-white rounded-lg text-sm font-medium hover:bg-[#b8994e] transition-colors"
          >
            Add to Canvas
          </button>
          <button
            onClick={() => setPreview(null)}
            className="w-full py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
