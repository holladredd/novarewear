import { useRef, useEffect } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import { useClipFunc } from "@/hooks/useClipFunc";

export default function LogoNodeBrowser({
  shapeProps,
  isSelected,
  onChange,
  clipObject,
}) {
  const [image, status] = useImage(shapeProps.imageUrl, "anonymous");
  const shapeRef = useRef();
  const trRef = useRef();
  const clipFunc = useClipFunc(clipObject, shapeProps);

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, image]);

  useEffect(() => {
    if (image && shapeRef.current) {
      if (shapeProps.colorize) {
        shapeRef.current.cache();
      } else {
        shapeRef.current.clearCache();
      }
      shapeRef.current.getLayer().batchDraw();
    }
  }, [
    image,
    shapeProps.colorize,
    shapeProps.colorizeRed,
    shapeProps.colorizeGreen,
    shapeProps.colorizeBlue,
  ]);

  if (status !== "loaded") return null;

  return (
    <>
      <Image
        ref={shapeRef}
        {...shapeProps}
        clipFunc={clipFunc} // Use the hook result
        image={image}
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
        filters={[Konva.Filters.Colorize]}
        colorizeRed={shapeProps.colorizeRed}
        colorizeGreen={shapeProps.colorizeGreen}
        colorizeBlue={shapeProps.colorizeBlue}
        colorize={shapeProps.colorize}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}
