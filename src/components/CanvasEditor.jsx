import { useEffect, useRef, memo } from "react";

function CanvasEditor({ onReady }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (instanceRef.current) return;

    async function initFabric() {
      const fabricModule = await import("fabric");
      const fabric = fabricModule.fabric || fabricModule;

      // Default settings for all objects
      fabric.Object.prototype.set({
        cornerStyle: "circle",
        cornerColor: "#2563eb",
        borderColor: "#2563eb",
        cornerSize: 10,
        transparentCorners: false,
        hasRotatingPoint: true,
        lockScalingFlip: false,
        selectable: true,
        evented: true,
      });

      fabricRef.current = fabric;

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 600,
        height: 600,
        backgroundColor: "#f3f4f6",
        selection: true,
        preserveObjectStacking: true,
      });

      // Enable double click to edit text
      canvas.on("mouse:dblclick", (opt) => {
        const target = opt.target;
        if (target && target.type === "textbox") {
          target.enterEditing();
          target.hiddenTextarea?.focus();
        }
      });

      instanceRef.current = canvas;

      if (onReady) {
        onReady(canvas, fabric);
      }
    }

    initFabric();
  }, [onReady]);

  return (
    <div className="border rounded-lg p-4 bg-white shadow-inner">
      <canvas ref={canvasRef} tabIndex={0} className="outline-none" />
      <p className="text-xs text-gray-500 mt-2 text-center">
        Hint: Drag objects, resize using corners, double-click text to edit.
      </p>
    </div>
  );
}

export default memo(CanvasEditor);
