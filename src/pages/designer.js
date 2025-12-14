import { useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import EditorToolbar from "../components/EditorToolbar";
import CanvasEditor from "../components/CanvasEditor";
import LayersPanel from "../components/LayersPanel";
import ObjectPanel from "../components/ObjectPanel";
import TemplatePanel from "../components/TemplatePanel";

export default function Designer() {
  const [canvas, setCanvas] = useState(null);
  const [fabric, setFabric] = useState(null);

  const handleCanvasReady = useCallback((canvasInstance, fabricInstance) => {
    setCanvas(canvasInstance);
    setFabric(fabricInstance);
  }, []);

  const handleSelectTemplate = useCallback(
    (svgPath) => {
      if (!canvas || !fabric) return;

      canvas.clear(); // Clear previous template

      fabric.loadSVGFromURL(svgPath, (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options);

        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        // Scale the object to fit the canvas while maintaining aspect ratio
        const scale = Math.min(
          canvasWidth / obj.width,
          canvasHeight / obj.height
        );
        obj.scale(scale);

        canvas.add(obj).centerObject(obj).renderAll();
      });
    },
    [canvas, fabric]
  );

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-grow">
        <div className="grid grid-cols-12 h-full">
          {/* Left Column */}
          <div className="col-span-2 bg-gray-100 p-1 overflow-y-auto">
            <TemplatePanel onSelectTemplate={handleSelectTemplate} />
            <LayersPanel canvas={canvas} />
          </div>

          {/* Center Column (Canvas) */}
          <div className="col-span-7 flex items-center justify-center bg-gray-200 p-4">
            <CanvasEditor onReady={handleCanvasReady} />
          </div>

          {/* Right Column */}
          <div className="col-span-3 bg-gray-100 p-4">
            <EditorToolbar canvas={canvas} fabric={fabric} />

            <ObjectPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
