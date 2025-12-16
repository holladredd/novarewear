import { useEffect, useState } from "react";

export default function Rulers({ stageRef, stageSize }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onMouseMove = (e) => {
      const pos = stage.getPointerPosition();
      if (pos) setMouse({ x: Math.round(pos.x), y: Math.round(pos.y) });
    };
    stage.on("mousemove", onMouseMove);
    return () => stage.off("mousemove", onMouseMove);
  }, [stageRef]);

  const rulerSize = 20; // px height/width of ruler bars

  return (
    <div className="relative">
      {/* horizontal ruler */}
      <div
        className="absolute top-0 left-0 bg-gray-50 border-b border-r border-gray-300 select-none"
        style={{ width: stageSize.width, height: rulerSize }}
      >
        <canvas
          className="w-full h-full"
          width={stageSize.width}
          height={rulerSize}
          ref={(c) => {
            if (!c) return;
            const ctx = c.getContext("2d");
            ctx.clearRect(0, 0, stageSize.width, rulerSize);
            ctx.fillStyle = "#6b7280"; // gray-500
            ctx.font = "10px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // ticks every 50 px
            for (let x = 0; x <= stageSize.width; x += 50) {
              ctx.fillRect(x, rulerSize - 5, 1, 5);
              ctx.fillText(String(x), x, rulerSize / 2 - 2);
            }
            // red mouse line
            ctx.strokeStyle = "#ef4444"; // red-500
            ctx.beginPath();
            ctx.moveTo(mouse.x, 0);
            ctx.lineTo(mouse.x, rulerSize);
            ctx.stroke();
          }}
        />
      </div>

      {/* vertical ruler */}
      <div
        className="absolute left-0 top-0 bg-gray-50 border-r border-b border-gray-300 select-none"
        style={{ width: rulerSize, height: stageSize.height }}
      >
        <canvas
          className="w-full h-full"
          width={rulerSize}
          height={stageSize.height}
          ref={(c) => {
            if (!c) return;
            const ctx = c.getContext("2d");
            ctx.clearRect(0, 0, rulerSize, stageSize.height);
            ctx.fillStyle = "#6b7280";
            ctx.font = "10px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            for (let y = 0; y <= stageSize.height; y += 50) {
              ctx.fillRect(rulerSize - 5, y, 5, 1);
              ctx.save();
              ctx.translate(rulerSize / 2, y);
              ctx.rotate(-Math.PI / 2);
              ctx.fillText(String(y), 0, 0);
              ctx.restore();
            }
            ctx.strokeStyle = "#ef4444";
            ctx.beginPath();
            ctx.moveTo(0, mouse.y);
            ctx.lineTo(rulerSize, mouse.y);
            ctx.stroke();
          }}
        />
      </div>

      {/* mouse coords badge */}
      <div className="absolute top-0 left-0 ml-5 mt-5 px-2 py-1 text-xs font-mono text-white bg-black/60 rounded pointer-events-none">
        {mouse.x} × {mouse.y}
      </div>
    </div>
  );
}
