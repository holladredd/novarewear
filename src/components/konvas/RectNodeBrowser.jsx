import { Rect, Transformer } from "react-konva";
import { useRef, useEffect } from "react";
import Konva from "konva";
import { useClipFunc } from "@/hooks/useClipFunc";

export default function RectNodeBrowser({
  shapeProps,
  isSelected,
  onChange,
  clipObject,
}) {
  const shapeRef = useRef();
  const trRef = useRef();
  const clipFunc = useClipFunc(clipObject, shapeProps);
  useEffect(() => {
    if (isSelected && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        ref={shapeRef}
        {...shapeProps}
        clipFunc={clipFunc} // Use the hook result
        draggable
        onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
        onTransformEnd={(e) => {
          const node = e.target;
          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}
