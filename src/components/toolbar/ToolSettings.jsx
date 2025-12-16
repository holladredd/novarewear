import BrushSettingsBrowser from "../tool-settings/BrushSettingsBrowser";
import EraserSettingsBrowser from "../tool-settings/EraserSettingsBrowser";
import MoveSettingsBrowser from "../tool-settings/MoveSettingsBrowser";
import TextSettingsBrowser from "../tool-settings/TextSettingsBrowser";
import { TOOLS } from "./tools";

export default function ToolSettings({
  activeTool,
  setActiveTool,
  selectedId,
  objects,
  setObjects,
  brushColor,
  setBrushColor,
  brushWidth,
  setBrushWidth,
  finishDrawing,
  setSelectedId,
}) {
  return (
    <div className="bg-white rounded p-4 shadow mb-4 space-y-4">
      {/* board colour – always visible when template exists */}
      {objects.some((o) => o.isTemplate) && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Board Colour
          </h3>
          <input
            type="color"
            value={objects.find((o) => o.isTemplate)?.fill || "#FFFFFF"}
            onChange={(e) =>
              setObjects((o) =>
                o.map((x) =>
                  x.isTemplate ? { ...x, fill: e.target.value } : x
                )
              )
            }
            className="w-full h-8 rounded cursor-pointer border-none"
          />
        </div>
      )}

      {activeTool === TOOLS.TEXT && (
        <TextSettingsBrowser
          selectedId={selectedId}
          objects={objects}
          setObjects={setObjects}
          setActiveTool={setActiveTool}
          setSelectedId={setSelectedId}
        />
      )}

      {activeTool === TOOLS.BRUSH && (
        <BrushSettingsBrowser
          color={brushColor}
          setColor={setBrushColor}
          width={brushWidth}
          setWidth={setBrushWidth}
          finishDrawing={finishDrawing}
        />
      )}

      {activeTool === TOOLS.ERASER && (
        <EraserSettingsBrowser width={brushWidth} setWidth={setBrushWidth} />
      )}

      {activeTool === TOOLS.MOVE && (
        <MoveSettingsBrowser selectedId={selectedId} setObjects={setObjects} />
      )}
    </div>
  );
}
