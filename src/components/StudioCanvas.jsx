import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Stage, Layer, Transformer, Rect, Line } from "react-konva";
import Navbar from "../components/Navbar";
import EditorToolbar from "../components/toolbar/EditorToolbar";
import LayersPanel from "../components/LayersPanel";
import ObjectPanel from "../components/ObjectPanel";
import TemplatePanel from "../components/TemplatePanel";
import LogoPanel from "../components/LogoPanel";
import ToolSettings from "../components/toolbar/ToolSettings";
import LayerActions from "@/components/LayerActions";
import LogoButton from "@/components/LogoButton";
import { FaThLarge } from "react-icons/fa";
import { TOOLS } from "../components/toolbar/tools";
import { v4 as uuid } from "uuid";
import useImage from "use-image";
import dynamic from "next/dynamic";
import Rulers from "./Rulers";
import AddImageButton from "./AddImageButton";
import { getPathData } from "@/utils/svg";

const TextNodeBrowser = dynamic(
  () => import("../components/konvas/TextNodeBrowser"),
  {
    ssr: false,
  }
);
const RectNode = dynamic(() => import("../components/konvas/RectNodeBrowser"), {
  ssr: false,
});

const DrawingLayer = dynamic(
  () => import("../components/konvas/DrawingLayerBrowser"),
  {
    ssr: false,
  }
);
const ImageNode = dynamic(
  () => import("../components/konvas/ImageNodeBrowser"),
  {
    ssr: false,
  }
);
const LogoNodeBrowser = dynamic(
  () => import("../components/konvas/LogoNodeBrowser"),
  {
    ssr: false,
  }
);
const PathNodeBrowser = dynamic(
  () => import("../components/konvas/PathNodeBrowser"),
  {
    ssr: false,
  }
);

/* ---------- main page component ---------- */
export default function Studio() {
  /* ---------- state ---------- */
  const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(false);
  const [isLogoPanelOpen, setIsLogoPanelOpen] = useState(false);
  const [activeTool, setActiveTool] = useState(TOOLS.MOVE);
  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(5);
  const [templateSet, setTemplateSet] = useState(false);
  const [templateColor, setTemplateColor] = useState("#FFFFFF");
  const [showRulers, setShowRulers] = useState(true);
  const CANVAS_W = 800;
  const CANVAS_H = 600;

  const stageRef = useRef();
  const hRulerContainerRef = useRef(null);
  const vRulerContainerRef = useRef(null);
  const [hRulerSize, setHRulerSize] = useState({ width: 0, height: 20 });
  const [vRulerSize, setVRulerSize] = useState({ width: 20, height: 0 });

  useEffect(() => {
    const hObs = new ResizeObserver(() => {
      if (hRulerContainerRef.current) {
        setHRulerSize({
          width: hRulerContainerRef.current.offsetWidth,
          height: 20,
        });
      }
    });
    if (hRulerContainerRef.current) hObs.observe(hRulerContainerRef.current);

    const vObs = new ResizeObserver(() => {
      if (vRulerContainerRef.current) {
        setVRulerSize({
          width: 20,
          height: vRulerContainerRef.current.offsetHeight,
        });
      }
    });
    if (vRulerContainerRef.current) vObs.observe(vRulerContainerRef.current);

    return () => {
      hObs.disconnect();
      vObs.disconnect();
    };
  }, [showRulers]);

  const templateUrl = useMemo(
    () => objects.find((o) => o.isTemplate)?.imageUrl || "",
    [objects]
  );
  const [templateImg] = useImage(templateUrl);

  /* ---------- helpers inside StudioCanvas ---------- */
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const executeExtendedAction = (obj, id) => {
    switch (obj.type) {
      case "text":
        window.dispatchEvent(new CustomEvent("textDblClick", { detail: id }));
        break;

      default:
      /* no-op */
    }
  };
  /* ---------- helpers ---------- */
  const handleSelectTemplate = useCallback((svgPath) => {
    const img = new Image(); // browser Image
    img.src = svgPath;
    img.onload = () => {
      // scale to fill canvas, center, lock
      // const scale = Math.max(
      //   CANVAS_W / img.naturalWidth,
      //   CANVAS_H / img.naturalHeight
      // );
      // const width = img.naturalWidth * scale;
      // const height = img.naturalHeight * scale;
      const x = CANVAS_W / 2;
      const y = CANVAS_H / 2;

      const template = {
        id: "template-bg",
        type: "image",
        imageUrl: svgPath,
        x,
        y,
        width: CANVAS_W,
        height: CANVAS_H,
        visible: true,
        draggable: false,
        isTemplate: true,
      };
      setObjects([template]); // replace everything – only background
      setTemplateSet(true);
      setTemplateColor("#FFFFFF");
    };
  }, []);
  const handleSelectLogo = useCallback((svgPath) => {
    // Force image mode - never fails
    const newLogo = {
      id: uuid(),
      type: "logo",
      imageUrl: svgPath,
      x: 200,
      y: 300,
      width: 200,
      height: 200,
      visible: true,
      draggable: true,
    };
    setObjects((o) => [...o, newLogo]);
  }, []);
  const toggleTemplatePanel = () => {
    setIsTemplatePanelOpen((p) => !p);
    if (isLogoPanelOpen) setIsLogoPanelOpen(false);
  };
  const toggleLogoPanel = () => {
    setIsLogoPanelOpen((p) => !p);
    if (isTemplatePanelOpen) setIsTemplatePanelOpen(false);
  };

  /* ---------- undo / redo ---------- */
  const history = useRef([]);
  const [step, setStep] = useState(-1);
  const saveHistory = () => {
    history.current = history.current.slice(0, step + 1);
    history.current.push(JSON.stringify(objects));
    setStep(history.current.length - 1);
  };

  useEffect(() => {
    if (objects.length) saveHistory();
  }, [objects]);

  const undo = () => {
    if (step <= 0) return;
    const prev = JSON.parse(history.current[step - 1]);
    setObjects(prev);
    setStep(step - 1);
  };
  const redo = () => {
    if (step >= history.current.length - 1) return;
    const next = JSON.parse(history.current[step + 1]);
    setObjects(next);
    setStep(step + 1);
  };

  /* ---------- shortcuts (Delete / Backspace / Escape) ---------- */
  useEffect(() => {
    const onKey = (e) => {
      /* >>>  BLOCK  if any text editor is open  <<< */
      if (document.querySelector("foreignObject textarea")) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        setObjects((o) => o.filter((obj) => obj.id !== selectedId));
        setSelectedId(null);
      }
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  /* ---------- one-time migration: ensure visible & draggable exist ---------- */
  useEffect(() => {
    setObjects((o) =>
      o.map((x) => ({
        ...x,
        visible: x.visible === undefined ? true : x.visible,
        draggable: x.draggable === undefined ? true : x.draggable,
      }))
    );
  }, []); // << empty array = run only once
  /* ---------- render ---------- */
  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white">
      <Navbar />

      {/* TOP BAR – inside the column, no layout shift */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">Canvas</span>
          <button
            onClick={() => setShowRulers((v) => !v)}
            className={`px-3 py-1 rounded-md text-sm transition-all duration-200 ${
              showRulers
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {showRulers ? "Hide Rulers" : "Show Rulers"}
          </button>
        </div>
        <div className="text-xs text-gray-500">
          {CANVAS_W} × {CANVAS_H}px
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="flex">
          <div className="flex flex-col bg-gray-100 p-2 border-r w-auto">
            <button
              onClick={toggleTemplatePanel}
              className={`p-3 rounded-lg mb-4 ${
                isTemplatePanelOpen
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              title="Templates"
            >
              <FaThLarge size={24} />
            </button>
            <EditorToolbar
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              setObjects={setObjects}
              undo={undo}
              redo={redo}
            />
            <LogoButton onClick={toggleLogoPanel} isOpen={isLogoPanelOpen} />
            {/* raster-only add button */}
            <AddImageButton
              onImageAdd={(newImage) => setObjects((o) => [...o, newImage])}
            />
          </div>

          <div
            className={`transition-all duration-300 ease-in-out bg-gray-100 overflow-y-auto border-r ${
              isTemplatePanelOpen || isLogoPanelOpen ? "w-80 p-4" : "w-0"
            }`}
          >
            {isTemplatePanelOpen && (
              <TemplatePanel
                onSelectTemplate={handleSelectTemplate}
                setObjects={setObjects}
              />
            )}
            {isLogoPanelOpen && (
              <LogoPanel
                onSelectLogo={handleSelectLogo}
                setObjects={setObjects}
              />
            )}
          </div>
        </div>

        {/* CENTER AND RIGHT PANELS */}
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            {showRulers && (
              <div className="flex">
                <div
                  style={{ width: 20, height: 20 }}
                  className="bg-gray-50 border-r border-b border-gray-300"
                ></div>
                <div className="flex-1" ref={hRulerContainerRef}>
                  <Rulers
                    stageRef={stageRef}
                    stageSize={hRulerSize}
                    orientation="horizontal"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-1">
              {showRulers && (
                <div ref={vRulerContainerRef}>
                  <Rulers
                    stageRef={stageRef}
                    stageSize={vRulerSize}
                    orientation="vertical"
                  />
                </div>
              )}
              <div className="flex-grow flex items-center justify-center bg-gray-100 p-4 overflow-auto">
                <div
                  className="border rounded-lg  bg-white shadow-lg"
                  style={{ width: CANVAS_W, height: CANVAS_H }}
                >
                  <Stage
                    width={CANVAS_W}
                    height={CANVAS_H}
                    className="bg-white"
                    onClick={(e) => {
                      const clicked = e.target;
                      if (clicked === e.target.getStage()) {
                        setSelectedId(null);
                        return;
                      }
                      const id = clicked.id();
                      if (!id) return;
                      setSelectedId(id);
                      const obj = objects.find((o) => o.id === id);
                      if (obj) setActiveTool(capitalize(obj.type));
                    }}
                    onDblClick={(e) => {
                      e.cancelBubble = true;
                      const id = e.target.id();
                      if (!id) return;
                      const obj = objects.find((o) => o.id === id);
                      if (obj) executeExtendedAction(obj, id);
                    }}
                    ref={stageRef}
                  >
                    <Layer>
                      {/* Debug: Show clip masks in red */}
                      {objects.map((obj) => {
                        if (!obj.clipById) return null;
                        const clipObj = objects.find(
                          (o) => o.id === obj.clipById
                        );
                        if (!clipObj) return null;

                        return (
                          <Rect
                            key={`clip-debug-${obj.id}`}
                            x={clipObj.x}
                            y={clipObj.y}
                            width={clipObj.width || 100}
                            height={clipObj.height || 100}
                            stroke="red"
                            strokeWidth={2}
                            listening={false}
                          />
                        );
                      })}

                      {/* template background – 90 % of Stage, centered, locked */}
                      {templateImg && (
                        <ImageNode
                          key="template-bg"
                          shapeProps={{
                            id: "template-bg",
                            type: "image",
                            imageUrl: templateUrl,
                            x:
                              (CANVAS_W -
                                (objects.find((o) => o.isTemplate)?.width ||
                                  CANVAS_W * 0.9)) /
                              2,
                            y:
                              (CANVAS_H -
                                (objects.find((o) => o.isTemplate)?.height ||
                                  CANVAS_H * 0.9)) /
                              2,
                            width:
                              objects.find((o) => o.isTemplate)?.width ||
                              CANVAS_W * 0.9,
                            height:
                              objects.find((o) => o.isTemplate)?.height ||
                              CANVAS_H * 0.9,
                            visible: true,
                            draggable: false,
                            isTemplate: true,
                          }}
                          isSelected={false}
                          onChange={() => {}} // locked – no change
                          loadedImage={templateImg}
                        />
                      )}

                      {/* user objects */}
                      {objects
                        .filter((o) => !o.isTemplate)
                        .map((obj) => {
                          // === DEBUG BLOCK - ADD THESE LINES ===
                          const clipObject = obj.clipById
                            ? objects.find((o) => o.id === obj.clipById)
                            : null;

                          if (clipObject) {
                            console.log(
                              `🔍 CLIPPING ACTIVE: ${obj.type}-${obj.id.slice(
                                0,
                                4
                              )} clipped by ${
                                clipObject.type
                              }-${clipObject.id.slice(0, 4)}`
                            );
                            console.log(
                              `   Shape at (${obj.x},${obj.y}) size ${
                                obj.width || 0
                              }x${obj.height || 0}`
                            );
                            console.log(
                              `   Clip at (${clipObject.x},${
                                clipObject.y
                              }) size ${clipObject.width || 0}x${
                                clipObject.height || 0
                              }`
                            );
                          }

                          if (obj.type === "text")
                            return (
                              <TextNodeBrowser
                                key={obj.id}
                                shapeProps={obj}
                                isSelected={obj.id === selectedId}
                                clipObject={clipObject}
                                onChange={(newAttrs) =>
                                  setObjects((o) =>
                                    o.map((x) =>
                                      x.id === obj.id
                                        ? { ...x, ...newAttrs }
                                        : x
                                    )
                                  )
                                }
                              />
                            );
                          if (obj.type === "rect")
                            return (
                              <RectNode
                                key={obj.id}
                                shapeProps={obj}
                                isSelected={obj.id === selectedId}
                                clipObject={clipObject}
                                onChange={(newAttrs) =>
                                  setObjects((o) =>
                                    o.map((x) =>
                                      x.id === obj.id
                                        ? { ...x, ...newAttrs }
                                        : x
                                    )
                                  )
                                }
                              />
                            );
                          if (obj.type === "image")
                            return (
                              <ImageNode
                                key={obj.id}
                                shapeProps={obj}
                                isSelected={obj.id === selectedId}
                                clipObject={clipObject}
                                onChange={(newAttrs) =>
                                  setObjects((o) =>
                                    o.map((x) =>
                                      x.id === obj.id
                                        ? { ...x, ...newAttrs }
                                        : x
                                    )
                                  )
                                }
                              />
                            );
                          if (obj.type === "logo")
                            return (
                              <LogoNodeBrowser
                                key={obj.id}
                                shapeProps={obj}
                                isSelected={obj.id === selectedId}
                                clipObject={clipObject}
                                onChange={(newAttrs) =>
                                  setObjects((o) =>
                                    o.map((x) =>
                                      x.id === obj.id
                                        ? { ...x, ...newAttrs }
                                        : x
                                    )
                                  )
                                }
                              />
                            );
                          if (obj.type === "path")
                            return (
                              <PathNodeBrowser
                                key={obj.id}
                                shapeProps={obj}
                                isSelected={obj.id === selectedId}
                                clipObject={clipObject}
                                onChange={(newAttrs) =>
                                  setObjects((o) =>
                                    o.map((x) =>
                                      x.id === obj.id
                                        ? { ...x, ...newAttrs }
                                        : x
                                    )
                                  )
                                }
                              />
                            );
                          return null;
                        })}

                      {(activeTool === TOOLS.BRUSH ||
                        activeTool === TOOLS.ERASER) && (
                        <DrawingLayer
                          tool={activeTool.toLowerCase()}
                          color={brushColor}
                          strokeWidth={brushWidth}
                        />
                      )}
                    </Layer>
                  </Stage>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Hint: Drag objects, resize using corners, double-click text
                    to edit.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* RIGHT PANEL */}
          <div className="w-80 bg-gray-100 text-gray-600 p-4 flex flex-col border-l border-gray-200">
            <div className="flex-grow overflow-y-auto">
              <ToolSettings
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                selectedId={selectedId}
                objects={objects}
                setObjects={setObjects}
                brushColor={brushColor}
                setBrushColor={setBrushColor}
                brushWidth={brushWidth}
                setBrushWidth={setBrushWidth}
                setSelectedId={setSelectedId}
              />
              <ObjectPanel
                selectedId={selectedId}
                objects={objects}
                onChange={(newAttrs) =>
                  setObjects((o) =>
                    o.map((x) =>
                      x.id === selectedId ? { ...x, ...newAttrs } : x
                    )
                  )
                }
              />
              <LayersPanel
                objects={objects}
                setObjects={setObjects}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            </div>
            <div className="mt-auto">
              <LayerActions
                objects={objects}
                setObjects={setObjects}
                selectedId={selectedId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
