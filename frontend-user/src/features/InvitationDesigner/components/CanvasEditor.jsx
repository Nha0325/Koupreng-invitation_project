import { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Image as KonvaImage, Transformer } from 'react-konva';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;

const CanvasEditor = ({ elements, selectedId, onSelect, onChange, background, zoom, stageRef }) => {
  const transformerRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (transformerRef.current && layerRef.current) {
      if (selectedId) {
        const node = layerRef.current.findOne(`#${selectedId}`);
        if (node) {
          transformerRef.current.nodes([node]);
          transformerRef.current.getLayer().batchDraw();
        }
      } else {
        transformerRef.current.nodes([]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage() || e.target.name() === 'background') {
      onSelect(null);
    }
  };

  const handleDragEnd = (e, id) => {
    onChange(id, { x: e.target.x(), y: e.target.y() });
  };

  const handleTransformEnd = (e, id) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    onChange(id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(20, node.width() * scaleX),
      height: node.height() * scaleY,
      rotation: node.rotation(),
    });
  };

  const renderBackground = () => {
    if (!background) return <Rect name="background" x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#ffffff" />;

    if (background.type === 'gradient') {
      const getGradientPoints = () => {
        switch (background.direction) {
          case 'horizontal':
            return { start: { x: 0, y: 0 }, end: { x: CANVAS_WIDTH, y: 0 } };
          case 'diagonal':
            return { start: { x: 0, y: 0 }, end: { x: CANVAS_WIDTH, y: CANVAS_HEIGHT } };
          default: // vertical
            return { start: { x: 0, y: 0 }, end: { x: 0, y: CANVAS_HEIGHT } };
        }
      };
      const { start, end } = getGradientPoints();
      return (
        <Rect
          name="background"
          x={0}
          y={0}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          fillLinearGradientStartPoint={start}
          fillLinearGradientEndPoint={end}
          fillLinearGradientColorStops={[0, background.color1 || '#000000', 1, background.color2 || '#333333']}
        />
      );
    }

    return <Rect name="background" x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill={background.color || '#ffffff'} />;
  };

  const renderElement = (el) => {
    if (el.type === 'text') {
      return (
        <Text
          key={el.id}
          id={el.id}
          x={el.x}
          y={el.y}
          text={el.text}
          fontSize={el.fontSize || 24}
          fontFamily={el.fontFamily || 'DM Sans'}
          fill={el.fill || '#000000'}
          width={el.width || 200}
          align={el.align || 'center'}
          fontStyle={`${el.bold ? 'bold' : ''} ${el.italic ? 'italic' : ''}`.trim() || 'normal'}
          opacity={el.opacity !== undefined ? el.opacity : 1}
          draggable
          rotation={el.rotation || 0}
          onClick={() => onSelect(el.id)}
          onTap={() => onSelect(el.id)}
          onDragEnd={(e) => handleDragEnd(e, el.id)}
          onTransformEnd={(e) => handleTransformEnd(e, el.id)}
        />
      );
    }

    if (el.type === 'image' && el.image) {
      return (
        <KonvaImage
          key={el.id}
          id={el.id}
          x={el.x}
          y={el.y}
          image={el.image}
          width={el.width || 200}
          height={el.height || 200}
          draggable
          rotation={el.rotation || 0}
          opacity={el.opacity !== undefined ? el.opacity : 1}
          onClick={() => onSelect(el.id)}
          onTap={() => onSelect(el.id)}
          onDragEnd={(e) => handleDragEnd(e, el.id)}
          onTransformEnd={(e) => handleTransformEnd(e, el.id)}
        />
      );
    }

    return null;
  };

  return (
    <div className="canvas-editor-container flex items-center justify-center bg-gray-100 overflow-auto flex-1 p-4">
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease',
        }}
      >
        <Stage
          ref={stageRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleStageClick}
          onTap={handleStageClick}
          className="shadow-2xl"
          style={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}
        >
          <Layer>
            {renderBackground()}
          </Layer>
          <Layer ref={layerRef}>
            {elements.map(renderElement)}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 20 || newBox.height < 20) return oldBox;
                return newBox;
              }}
              rotateEnabled={true}
              enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right']}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export { CANVAS_WIDTH, CANVAS_HEIGHT };
export default CanvasEditor;
