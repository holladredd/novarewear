import { Text, Transformer } from "react-konva";
import { useRef, useEffect, useState } from "react";
import { Html } from "react-konva-utils";
import Konva from "konva";
import { useClipFunc } from "@/hooks/useClipFunc";

export default function TextNodeBrowser({
  shapeProps,
  isSelected,
  onChange,
  clipObject,
}) {
  const shapeRef = useRef();
  const trRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const clipFunc = useClipFunc(clipObject, shapeProps);

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    const onDblClick = (e) => {
      if (e.detail === shapeProps.id) setIsEditing(true);
    };
    window.addEventListener("textDblClick", onDblClick);
    return () => window.removeEventListener("textDblClick", onDblClick);
  }, [shapeProps.id]);

  if (isEditing)
    return (
      <Html>
        <textarea
          value={shapeProps.text}
          onChange={(e) => onChange({ text: e.target.value })}
          onBlur={() => setIsEditing(false)}
          style={{
            position: "absolute",
            top: shapeRef.current.y() + "px",
            left: shapeRef.current.x() + "px",
            width: shapeRef.current.width(),
            height: shapeRef.current.height(),
            border: "none",
            padding: "0px",
            margin: "0px",
            overflow: "hidden",
            background: "none",
            outline: "none",
            resize: "none",
            transformOrigin: "left top",
            fontSize: shapeRef.current.fontSize(),
            fontFamily: shapeRef.current.fontFamily(),
            transform: "rotateZ(" + shapeRef.current.rotation() + "deg)",
            color: shapeRef.current.fill(),
          }}
        />
      </Html>
    );

  return (
    <>
      <Text
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
