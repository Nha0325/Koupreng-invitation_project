import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stage, Layer, Rect, Text, Image as KonvaImage } from 'react-konva';
import { invitationService } from '../../shared/services/invitationService';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;

const PreviewInvitationPage = () => {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [imagesLoading, setImagesLoading] = useState(false);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        setLoading(true);
        const res = await invitationService.getSharedInvitation(shareToken);
        const data = res.data;
        if (data?.canvasDataJson) {
          const canvasData = JSON.parse(data.canvasDataJson);
          const parsedInvitation = {
            title: data.title,
            background: canvasData.background || { type: 'solid', color: '#ffffff' },
            elements: canvasData.elements || [],
          };
          setInvitation(parsedInvitation);

          // Load image elements
          const imageElements = (canvasData.elements || []).filter(
            (el) => el.type === 'image' && el.src
          );
          if (imageElements.length > 0) {
            setImagesLoading(true);
            const loaded = {};
            await Promise.all(
              imageElements.map(
                (el) =>
                  new Promise((resolve) => {
                    const img = new window.Image();
                    img.onload = () => {
                      loaded[el.id] = img;
                      resolve();
                    };
                    img.onerror = () => {
                      resolve();
                    };
                    img.src = el.src;
                  })
              )
            );
            setLoadedImages(loaded);
            setImagesLoading(false);
          }
        } else {
          setError('Invitation not found');
        }
      } catch {
        setError('Unable to load this invitation. It may have been removed or the link is invalid.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, [shareToken]);

  const renderBackground = () => {
    if (!invitation?.background) {
      return <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#ffffff" />;
    }
    const bg = invitation.background;
    if (bg.type === 'gradient') {
      const getGradientPoints = () => {
        switch (bg.direction) {
          case 'horizontal':
            return { start: { x: 0, y: 0 }, end: { x: CANVAS_WIDTH, y: 0 } };
          case 'diagonal':
            return { start: { x: 0, y: 0 }, end: { x: CANVAS_WIDTH, y: CANVAS_HEIGHT } };
          default:
            return { start: { x: 0, y: 0 }, end: { x: 0, y: CANVAS_HEIGHT } };
        }
      };
      const { start, end } = getGradientPoints();
      return (
        <Rect
          x={0}
          y={0}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          fillLinearGradientStartPoint={start}
          fillLinearGradientEndPoint={end}
          fillLinearGradientColorStops={[0, bg.color1 || '#000', 1, bg.color2 || '#333']}
        />
      );
    }
    return <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill={bg.color || '#ffffff'} />;
  };

  if (loading || imagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#c8a96e] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#c8a96e] text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Invitation Preview */}
      <div className="mb-8 shadow-2xl rounded-lg overflow-hidden">
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <Layer>
            {renderBackground()}
            {invitation?.elements?.map((el) => {
              if (el.type === 'image' && el.src) {
                const img = loadedImages[el.id];
                if (!img) return null;
                return (
                  <KonvaImage
                    key={el.id}
                    x={el.x}
                    y={el.y}
                    image={img}
                    width={el.width || 200}
                    height={el.height || 200}
                    rotation={el.rotation || 0}
                    opacity={el.opacity !== undefined ? el.opacity : 1}
                  />
                );
              }
              return (
                <Text
                  key={el.id}
                  x={el.x}
                  y={el.y}
                  text={el.text}
                  fontSize={el.fontSize || 24}
                  fontFamily={el.fontFamily || 'DM Sans'}
                  fill={el.fill || '#000000'}
                  width={el.width || 200}
                  align={el.align || 'center'}
                  fontStyle={`${el.bold ? 'bold' : ''} ${el.italic ? 'italic' : ''}`.trim() || 'normal'}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-gray-500 text-sm mb-3">Want to create your own invitation?</p>
        <button
          onClick={() => navigate('/invitation-templates')}
          className="px-6 py-3 bg-[#c8a96e] text-white rounded-lg font-medium hover:bg-[#b8994e] transition-colors shadow-lg"
        >
          Create Your Own
        </button>
      </div>
    </div>
  );
};

export default PreviewInvitationPage;
