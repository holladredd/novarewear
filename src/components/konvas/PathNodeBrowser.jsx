import { useRef, useEffect } from "react";
import { Path, Transformer } from "react-konva";
import { useClipFunc } from "../../hooks/useClipFunc";

const PathNodeBrowser = ({ shapeProps, isSelected, onChange, clipObject }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  // ALWAYS call the hook - this is the fix for "Rendered more hooks"
  const clipFunc = useClipFunc(clipObject, shapeProps);

  // Effect for transformer
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Auto-fix path position and scale
  useEffect(() => {
    if (!shapeRef.current || !shapeProps.path) return;

    const node = shapeRef.current;
    const bounds = node.getSelfRect();

    if (bounds.width > 0) {
      // Center path if it's off-screen
      if (bounds.x > 500 || bounds.y > 500 || bounds.x < -100) {
        const offsetX = -bounds.x + 100;
        const offsetY = -bounds.y + 100;
        node.x(offsetX);
        node.y(offsetY);
      }

      // Scale it down
      const scale = Math.min(150 / bounds.width, 150 / bounds.height);
      node.scaleX(scale);
      node.scaleY(scale);

      node.getLayer().batchDraw();
    }
  }, [shapeProps.path]);

  // RENDER BOTH - never conditionally render hooks
  return (
    <>
      <Path
        ref={shapeRef}
        {...shapeProps}
        data={shapeProps.path}
        draggable={shapeProps.draggable}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (node) {
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              scaleX: node.scaleX(),
              scaleY: node.scaleY(),
            });
          }
        }}
        clipFunc={clipFunc}
        fill={shapeProps.fill || "#000000"}
        stroke={shapeProps.stroke || "transparent"}
        strokeWidth={shapeProps.strokeWidth || 0}
      />
      <Transformer
        ref={trRef}
        nodes={isSelected && shapeRef.current ? [shapeRef.current] : []}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < 5 || newBox.height < 5) {
            return oldBox;
          }
          return newBox;
        }}
      />
    </>
  );
};

export default PathNodeBrowser;
