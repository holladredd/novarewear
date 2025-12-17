import { useMemo } from "react";

/* ---------- tiny preview canvas ---------- */
function Preview({ obj }) {
  const url = useMemo(() => {
    if (obj.type === "image" || obj.type === "logo") return obj.imageUrl;
    // text / rect / brush – return transparent 1×1 px
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  }, [obj]);

  return (
    <div className="mb-3">
      <img
        src={url}
        alt="preview"
        className="w-full h-24 object-contain border rounded bg-white"
      />
    </div>
  );
}

/* ---------- main panel ---------- */
export default function ObjectPanel({ selectedId, objects, onChange }) {
  const obj = objects.find((o) => o.id === selectedId);
  if (!obj) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p>No object selected</p>
      </div>
    );
  }

  const update = (attrs) => onChange({ ...obj, ...attrs });

  /* ---------- type-specific controls ---------- */
  const controls = () => {
    switch (obj.type) {
      case "text":
        return (
          <>
            <label className="text-sm">Text</label>
            <input
              type="text"
              value={obj.text || ""}
              onChange={(e) => update({ text: e.target.value })}
              className="w-full mb-2 px-2 py-1 border rounded"
            />
            <label className="text-sm">Font Size</label>
            <input
              type="number"
              min="8"
              max="200"
              value={obj.fontSize || 24}
              onChange={(e) => update({ fontSize: Number(e.target.value) })}
              className="w-full mb-2 px-2 py-1 border rounded"
            />
          </>
        );

      case "rect":
        return (
          <>
            <label className="text-sm">Fill</label>
            <input
              type="color"
              value={obj.fill || "#ffffff"}
              onChange={(e) => update({ fill: e.target.value })}
              className="w-full mb-2 h-8 border rounded"
            />
            <label className="text-sm">Stroke</label>
            <input
              type="color"
              value={obj.stroke || "#000000"}
              onChange={(e) => update({ stroke: e.target.value })}
              className="w-full mb-2 h-8 border rounded"
            />
            <label className="text-sm">Stroke Width</label>
            <input
              type="number"
              min="0"
              max="50"
              value={obj.strokeWidth || 1}
              onChange={(e) => update({ strokeWidth: Number(e.target.value) })}
              className="w-full mb-2 px-2 py-1 border rounded"
            />
          </>
        );

      // case "image":
      //   return (
      //     <>
      //       <label className="text-sm">Replace Image</label>
      //       <input
      //         type="file"
      //         accept="image/*"
      //         onChange={(e) => {
      //           const file = e.target.files[0];
      //           if (!file) return;
      //           const url = URL.createObjectURL(file);
      //           update({ imageUrl: url });
      //         }}
      //         className="w-full mb-2"
      //       />
      //     </>
      //   );
      case "image": {
        const hexToRgb = (hex) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
              }
            : null;
        };

        const rgbToHex = (r, g, b) =>
          "#" +
          [r, g, b]
            .map((x) => {
              const hex = x.toString(16);
              return hex.length === 1 ? "0" + hex : hex;
            })
            .join("");

        const colorHex = rgbToHex(
          obj.colorizeRed || 0,
          obj.colorizeGreen || 0,
          obj.colorizeBlue || 0
        );

        return (
          <>
            <div className="flex items-center justify-between">
              <label className="text-sm">Color Overlay</label>
              <input
                type="checkbox"
                checked={!!obj.colorize}
                onChange={(e) => update({ colorize: e.target.checked })}
              />
            </div>
            {obj.colorize && (
              <div className="mt-2">
                <label className="text-sm">Tint Color</label>
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => {
                    const rgb = hexToRgb(e.target.value);
                    if (rgb) {
                      update({
                        colorizeRed: rgb.r,
                        colorizeGreen: rgb.g,
                        colorizeBlue: rgb.b,
                      });
                    }
                  }}
                  className="w-full h-8 border rounded"
                />
              </div>
            )}
          </>
        );
      }
      case "logo": {
        const hexToRgb = (hex) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
              }
            : null;
        };

        const rgbToHex = (r, g, b) =>
          "#" +
          [r, g, b]
            .map((x) => {
              const hex = x.toString(16);
              return hex.length === 1 ? "0" + hex : hex;
            })
            .join("");

        const colorHex = rgbToHex(
          obj.colorizeRed || 0,
          obj.colorizeGreen || 0,
          obj.colorizeBlue || 0
        );

        return (
          <>
            <div className="flex items-center justify-between">
              <label className="text-sm">Color Overlay</label>
              <input
                type="checkbox"
                checked={!!obj.colorize}
                onChange={(e) => update({ colorize: e.target.checked })}
              />
            </div>
            {obj.colorize && (
              <div className="mt-2">
                <label className="text-sm">Tint Color</label>
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => {
                    const rgb = hexToRgb(e.target.value);
                    if (rgb) {
                      update({
                        colorizeRed: rgb.r,
                        colorizeGreen: rgb.g,
                        colorizeBlue: rgb.b,
                      });
                    }
                  }}
                  className="w-full h-8 border rounded"
                />
              </div>
            )}
          </>
        );
      }

      case "brush":
        return (
          <>
            <label className="text-sm">Stroke Width</label>
            <input
              type="number"
              min="1"
              max="50"
              value={obj.strokeWidth || 5}
              onChange={(e) => update({ strokeWidth: Number(e.target.value) })}
              className="w-full mb-2 px-2 py-1 border rounded"
            />
            <label className="text-sm">Color</label>
            <input
              type="color"
              value={obj.color || "#000000"}
              onChange={(e) => update({ color: e.target.value })}
              className="w-full mb-2 h-8 border rounded"
            />
          </>
        );

      default:
        return null;
    }
  };

  /* ---------- universal controls ---------- */
  return (
    <div className="p-4 bg-gray-100 rounded-lg space-y-3">
      <h3 className="text-lg font-semibold">Properties</h3>

      {/* preview thumbnail */}
      <Preview obj={obj} />

      <p className="text-sm">
        Type: <span className="capitalize font-medium">{obj.type}</span>
      </p>

      {/* opacity */}
      <label className="text-sm">Opacity</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={obj.opacity || 1}
        onChange={(e) => update({ opacity: parseFloat(e.target.value) })}
        className="w-full"
      />

      {/* blend mode */}
      <label className="text-sm">Blend Mode</label>
      <select
        value={obj.globalCompositeOperation || "source-over"}
        onChange={(e) => update({ globalCompositeOperation: e.target.value })}
        className="w-full px-2 py-1 border rounded"
      >
        <option value="source-over">Normal</option>
        <option value="multiply">Multiply</option>
        <option value="screen">Screen</option>
        <option value="overlay">Overlay</option>
        <option value="darken">Darken</option>
        <option value="lighten">Lighten</option>
        <option value="color-dodge">Color Dodge</option>
        <option value="color-burn">Color Burn</option>
        <option value="hard-light">Hard Light</option>
        <option value="soft-light">Soft Light</option>
        <option value="difference">Difference</option>
        <option value="exclusion">Exclusion</option>
      </select>

      {/* type-specific block */}
      {controls()}

      {/* clipping */}
      <div className="border-t pt-3 mt-3">
        <label className="text-sm font-semibold">Clip to Object</label>
        <select
          value={obj.clipById || ""}
          onChange={(e) => update({ clipById: e.target.value || undefined })}
          className="w-full px-2 py-1 border rounded mt-1"
        >
          <option value="">None</option>
          {objects
            .filter((o) => o.id !== selectedId)
            .map((o) => (
              <option key={o.id} value={o.id}>
                {o.type} ({o.id.slice(0, 4)})
              </option>
            ))}
        </select>
      </div>

      {/* alignment quick buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => update({ align: "left" })}
          className="px-2 py-1 border rounded text-xs"
        >
          Left
        </button>
        <button
          onClick={() => update({ align: "center" })}
          className="px-2 py-1 border rounded text-xs"
        >
          Center
        </button>
        <button
          onClick={() => update({ align: "right" })}
          className="px-2 py-1 border rounded text-xs"
        >
          Right
        </button>
      </div>
    </div>
  );
}
