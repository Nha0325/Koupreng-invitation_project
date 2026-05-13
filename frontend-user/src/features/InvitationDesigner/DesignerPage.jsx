import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import templates from './data/templates';
import CanvasEditor from './components/CanvasEditor';
import Toolbar from './components/Toolbar';
import TextEditor from './components/TextEditor';
import ImageUploader from './components/ImageUploader';
import ThemePanel from './components/ThemePanel';
import TemplateSidebar from './components/TemplateSidebar';
import PreviewPanel from './components/PreviewPanel';
import ExportPanel from './components/ExportPanel';
import './InvitationDesigner.css';

const DesignerPage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const stageRef = useRef(null);

  const template = useMemo(() => templates.find((t) => t.id === templateId), [templateId]);
  const initialElements = useMemo(() => {
    if (!template) return [];
    return template.canvasConfig.elements.map((el, idx) => ({
      ...el,
      id: el.id || `el-${idx}`,
    }));
  }, [template]);

  const [elements, setElements] = useState(initialElements);
  const [selectedId, setSelectedId] = useState(null);
  const [background, setBackground] = useState(() => template?.canvasConfig?.background || { type: 'solid', color: '#ffffff' });
  const [zoom, setZoom] = useState(0.85);
  const [history, setHistory] = useState(() => [initialElements]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [leftPanel, setLeftPanel] = useState('elements');
  const [showImageUploader, setShowImageUploader] = useState(false);



  // Push to history
  const pushHistory = useCallback((newElements) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, newElements];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Element change handler
  const handleElementChange = (id, props) => {
    const updated = elements.map((el) =>
      el.id === id ? { ...el, ...props } : el
    );
    setElements(updated);
    pushHistory(updated);
  };

  // Add element
  const handleAddElement = (newEl) => {
    const updated = [...elements, newEl];
    setElements(updated);
    pushHistory(updated);
    setSelectedId(newEl.id);
  };

  // Add text
  const handleAddText = () => {
    const newEl = {
      id: `text-${Date.now()}`,
      type: 'text',
      text: 'New Text',
      x: 200,
      y: 350,
      fontSize: 24,
      fontFamily: 'DM Sans',
      fill: '#333333',
      width: 200,
      align: 'center',
      bold: false,
      italic: false,
      opacity: 1,
    };
    handleAddElement(newEl);
  };

  // Add image from data URL
  const handleAddImage = (dataUrl) => {
    const img = new window.Image();
    img.onload = () => {
      const maxW = 300;
      const ratio = img.width / img.height;
      const w = Math.min(maxW, img.width);
      const h = w / ratio;
      const newEl = {
        id: `img-${Date.now()}`,
        type: 'image',
        x: 150,
        y: 200,
        width: w,
        height: h,
        image: img,
        opacity: 1,
      };
      handleAddElement(newEl);
      setShowImageUploader(false);
    };
    img.src = dataUrl;
  };

  // Delete selected
  const handleDelete = () => {
    if (!selectedId) return;
    const updated = elements.filter((el) => el.id !== selectedId);
    setElements(updated);
    setSelectedId(null);
    pushHistory(updated);
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setElements(history[newIndex]);
    setSelectedId(null);
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setElements(history[newIndex]);
    setSelectedId(null);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(2, z + 0.1));
  const handleZoomOut = () => setZoom((z) => Math.max(0.3, z - 0.1));
  const handleZoomFit = () => setZoom(0.85);

  // Layer ordering
  const handleLayerUp = () => {
    if (!selectedId) return;
    const idx = elements.findIndex((el) => el.id === selectedId);
    if (idx < elements.length - 1) {
      const updated = [...elements];
      [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
      setElements(updated);
      pushHistory(updated);
    }
  };

  const handleLayerDown = () => {
    if (!selectedId) return;
    const idx = elements.findIndex((el) => el.id === selectedId);
    if (idx > 0) {
      const updated = [...elements];
      [updated[idx], updated[idx - 1]] = [updated[idx - 1], updated[idx]];
      setElements(updated);
      pushHistory(updated);
    }
  };

  // Save (placeholder - would call API)
  const handleSave = async () => {
    // In a full implementation, this would save to backend
    alert('Invitation saved!');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          handleDelete();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, historyIndex, elements]);

  const selectedElement = elements.find((el) => el.id === selectedId);

  return (
    <div className="designer-page h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Top bar with back button */}
      <div className="designer-topbar flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <button
          onClick={() => navigate('/invitation-templates')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Templates
        </button>
        <span className="text-sm text-gray-400">
          {templates.find((t) => t.id === templateId)?.name || 'Custom Design'}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#c8a96e] text-white text-sm rounded-lg font-medium hover:bg-[#b8994e] transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar
        onAddText={handleAddText}
        onUploadImage={() => setShowImageUploader(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomFit={handleZoomFit}
        onLayerUp={handleLayerUp}
        onLayerDown={handleLayerDown}
        onDelete={handleDelete}
        onPreview={() => setShowPreview(true)}
        onSave={handleSave}
        onExport={() => setShowExport(true)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        hasSelection={!!selectedId}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setLeftPanel('elements')}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                leftPanel === 'elements' ? 'text-[#c8a96e] border-b-2 border-[#c8a96e]' : 'text-gray-500'
              }`}
            >
              Elements
            </button>
            <button
              onClick={() => setLeftPanel('theme')}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                leftPanel === 'theme' ? 'text-[#c8a96e] border-b-2 border-[#c8a96e]' : 'text-gray-500'
              }`}
            >
              Theme
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {leftPanel === 'elements' && (
              <TemplateSidebar onAddElement={handleAddElement} />
            )}
            {leftPanel === 'theme' && (
              <ThemePanel background={background} onBackgroundChange={setBackground} />
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <CanvasEditor
          elements={elements}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onChange={handleElementChange}
          background={background}
          zoom={zoom}
          stageRef={stageRef}
        />

        {/* Right Sidebar */}
        <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
          {showImageUploader ? (
            <div>
              <div className="flex items-center justify-between px-4 pt-4">
                <h3 className="font-semibold text-gray-800 text-sm">Upload Image</h3>
                <button
                  onClick={() => setShowImageUploader(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ImageUploader onAddImage={handleAddImage} />
            </div>
          ) : (
            <TextEditor element={selectedElement} onChange={handleElementChange} />
          )}
        </div>
      </div>

      {/* Mobile Warning */}
      <div className="designer-mobile-warning hidden">
        <div className="text-center p-8">
          <p className="text-lg font-semibold text-gray-700 mb-2">Desktop Recommended</p>
          <p className="text-sm text-gray-500">
            The invitation designer works best on larger screens. Please use a desktop or tablet for the best experience.
          </p>
          <button
            onClick={() => navigate('/invitation-templates')}
            className="mt-4 px-4 py-2 bg-[#c8a96e] text-white rounded-lg text-sm"
          >
            Back to Templates
          </button>
        </div>
      </div>

      {/* Modals */}
      {showPreview && (
        <PreviewPanel stageRef={stageRef} onClose={() => setShowPreview(false)} />
      )}
      {showExport && (
        <ExportPanel stageRef={stageRef} onClose={() => setShowExport(false)} invitationId={null} />
      )}
    </div>
  );
};

export default DesignerPage;
