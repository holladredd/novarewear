export default function EditorToolbar({ canvas, fabric }) {
  const addText = () => {
    if (!canvas || !fabric) return;

    const text = new fabric.Textbox("Edit text", {
      left: 120,
      top: 120,
      width: 220,
      fontSize: 22,
      fill: "#000",
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
      cornerColor: "#2563eb",
      borderColor: "#2563eb",
      cornerSize: 10,
      transparentCorners: false,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();

    setTimeout(() => {
      canvas.setActiveObject(text);
      text.enterEditing();
      text.hiddenTextarea?.focus();
    }, 0);
  };

  const changeFont = (fontFamily) => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === "textbox") {
      obj.set({ fontFamily });
      canvas.renderAll();
    }
  };

  const changeFontSize = (size) => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === "textbox") {
      obj.set({ fontSize: size });
      canvas.renderAll();
    }
  };

  const changeColor = (color) => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === "textbox") {
      obj.set({ fill: color });
      canvas.renderAll();
    }
  };

  return (
    <div className="p-2 bg-gray-100 border-b">
      {canvas ? (
        <div className="flex items-center space-x-2">
          <button
            onClick={addText}
            className="px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-50"
          >
            Add Text
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-500">Initializing Canvas...</div>
      )}

      <div className="flex items-center space-x-2 mt-2">
        <select
          onChange={(e) => changeFont(e.target.value)}
          className="border rounded px-1 py-1"
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
        </select>

        <input
          type="number"
          min="8"
          max="100"
          defaultValue={20}
          onChange={(e) => changeFontSize(parseInt(e.target.value))}
          className="border rounded w-16 px-1 py-1"
        />

        <input
          type="color"
          onChange={(e) => changeColor(e.target.value)}
          className="w-8 h-8 p-0 border-0"
        />
      </div>
    </div>
  );
}
