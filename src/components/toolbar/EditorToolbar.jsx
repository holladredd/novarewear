import {
  FaMousePointer,
  FaHandPaper,
  FaPaintBrush,
  FaEraser,
  FaFont,
} from "react-icons/fa";
import { RiArrowUpDownFill } from "react-icons/ri";
import { TOOLS } from "./tools";

export default function EditorToolbar({
  activeTool,
  setActiveTool,
  setObjects,
}) {
  /* ---------- unified button ---------- */
  const toolBtn = (tool, Icon, action) => (
    <button
      onClick={action || (() => setActiveTool(tool))}
      className={`p-3 rounded ${
        activeTool === tool
          ? "bg-blue-500 text-white"
          : "bg-white text-gray-600"
      }`}
      title={tool}
    >
      <Icon />
    </button>
  );

  return (
    <div className="flex flex-col gap-2 p-2 bg-gray-200 rounded">
      {toolBtn(TOOLS.SELECT, FaMousePointer)}
      {toolBtn(TOOLS.MOVE, RiArrowUpDownFill)}
      {toolBtn(TOOLS.TEXT, FaFont)}
      {toolBtn(TOOLS.BRUSH, FaPaintBrush)} {/* mode only */}
      {toolBtn(TOOLS.ERASER, FaEraser)} {/* mode only */}
    </div>
  );
}
