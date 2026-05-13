import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stage, Layer, Rect, Text } from 'react-konva';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;

const PreviewInvitationPage = () => {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    // In production, this would call invitationService.getSharedInvitation(shareToken)
    // For now, show a demo invitation
    setTimeout(() => {
      setInvitation({
        title: 'Wedding Invitation',
        background: { type: 'solid', color: '#fdf6e3' },
        elements: [
          { id: 'title', type: 'text', text: 'Wedding Invitation', x: 150, y: 80, fontSize: 28, fontFamily: 'Georgia', fill: '#c8a96e', align: 'center', width: 300 },
          { id: 'names', type: 'text', text: 'Sophea & Dara', x: 100, y: 300, fontSize: 44, fontFamily: 'Georgia', fill: '#2d2d2d', align: 'center', width: 400, bold: true },
          { id: 'date', type: 'text', text: 'January 15, 2026', x: 200, y: 420, fontSize: 20, fontFamily: 'DM Sans', fill: '#666666', align: 'center', width: 200 },
          { id: 'venue', type: 'text', text: 'Grand Palace Hotel', x: 175, y: 480, fontSize: 18, fontFamily: 'DM Sans', fill: '#c8a96e', align: 'center', width: 250 },
        ],
      });
      setLoading(false);
    }, 500);
  }, [shareToken]);

  const renderBackground = () => {
    if (!invitation?.background) {
      return <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#ffffff" />;
    }
    const bg = invitation.background;
    if (bg.type === 'gradient') {
      return (
        <Rect
          x={0}
          y={0}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 0, y: CANVAS_HEIGHT }}
          fillLinearGradientColorStops={[0, bg.color1 || '#000', 1, bg.color2 || '#333']}
        />
      );
    }
    return <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill={bg.color || '#ffffff'} />;
  };

  if (loading) {
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
            {invitation?.elements?.map((el) => (
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
            ))}
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
