import { useRef, useEffect } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import { useClipFunc } from "@/hooks/useClipFunc";

export default function ImageNodeBrowser({
  shapeProps,
  isSelected,
  onChange,
  loadedImage,
  clipObject,
}) {
  const [image, status] = useImage(shapeProps.imageUrl, "anonymous");
  const finalImage = loadedImage || image;
  const shapeRef = useRef();
  const trRef = useRef();
  const clipFunc = useClipFunc(clipObject, shapeProps);

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, finalImage]);

  useEffect(() => {
    if (finalImage && shapeRef.current) {
      if (shapeProps.colorize) {
        shapeRef.current.cache();
      } else {
        shapeRef.current.clearCache();
      }
      shapeRef.current.getLayer().batchDraw();
    }
  }, [
    finalImage,
    shapeProps.colorize,
    shapeProps.colorizeRed,
    shapeProps.colorizeGreen,
    shapeProps.colorizeBlue,
  ]);

  if (!finalImage) return null;
  if (!loadedImage && status !== "loaded") return null;

  return (
    <>
      <Image
        ref={shapeRef}
        {...shapeProps}
        image={finalImage}
        clipFunc={clipFunc} // Now using the memoized clip function
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
