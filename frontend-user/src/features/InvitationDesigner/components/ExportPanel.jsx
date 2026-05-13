import { useState } from 'react';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { invitationService } from '../../../shared/services/invitationService';

const ExportPanel = ({ stageRef, onClose, invitationId }) => {
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState('1x');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    if (!stageRef?.current) return;

    const pixelRatio = quality === '2x' ? 2 : 1;

    if (format === 'pdf') {
      const dataUrl = stageRef.current.toDataURL({ pixelRatio, mimeType: 'image/png' });
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [600, 800],
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 600, 800);
      pdf.save('invitation.pdf');
    } else {
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const ext = format === 'jpg' ? 'jpg' : 'png';
      const dataUrl = stageRef.current.toDataURL({ pixelRatio, mimeType });

      // Convert base64 to blob
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      saveAs(blob, `invitation.${ext}`);
    }
  };

  const handleGenerateShareLink = async () => {
    if (!invitationId) return;
    setLoading(true);
    try {
      const res = await invitationService.generateShareLink(invitationId);
      const url = res.data?.shareUrl || `${window.location.origin}/preview/${res.data?.shareToken}`;
      setShareUrl(url);
    } catch {
      setShareUrl(`${window.location.origin}/preview/demo-share-link`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-800 text-lg">Export Invitation</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Format Selection */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">Format</label>
          <div className="flex gap-2">
            {['png', 'jpg', 'pdf'].map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  format === f
                    ? 'bg-[#c8a96e] text-white border-[#c8a96e]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Selection */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">Quality</label>
          <div className="flex gap-2">
            <button
              onClick={() => setQuality('1x')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                quality === '1x'
                  ? 'bg-[#c8a96e] text-white border-[#c8a96e]'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Standard (1x)
            </button>
            <button
              onClick={() => setQuality('2x')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                quality === '2x'
                  ? 'bg-[#c8a96e] text-white border-[#c8a96e]'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              High (2x)
            </button>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full py-3 bg-[#c8a96e] text-white rounded-lg font-medium hover:bg-[#b8994e] transition-colors mb-4"
        >
          Download {format.toUpperCase()}
        </button>

        {/* Share Link */}
        <div className="border-t border-gray-100 pt-4">
          <button
            onClick={handleGenerateShareLink}
            disabled={loading || !invitationId}
            className="w-full py-3 border border-[#c8a96e] text-[#c8a96e] rounded-lg font-medium hover:bg-[#c8a96e]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={!invitationId ? 'Save your invitation first to generate a share link' : ''}
          >
            {loading ? 'Generating...' : !invitationId ? 'Save First to Share' : 'Generate Share Link'}
          </button>

          {shareUrl && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 truncate"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
