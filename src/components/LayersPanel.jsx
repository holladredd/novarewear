import { useEffect, useState } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaLockOpen,
  FaTrash,
} from "react-icons/fa";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable layer component
function LayerItem({
  obj,
  selectObject,
  moveUp,
  moveDown,
  toggleVisibility,
  toggleLock,
  deleteObject,
  activeId,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: obj.__uid,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: obj === activeId ? "2px solid #2563eb" : "1px solid transparent",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 mb-2 bg-white rounded space-y-1 shadow-sm flex flex-col justify-between items-center cursor-pointer"
      onClick={() => selectObject(obj)}
    >
      <span className="capitalize w-full">{obj.type}</span>
      <div className="flex space-x-1 w-full justify-end z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            moveUp(obj);
          }}
          className="px-1 py-0.5 border rounded text-xs"
        >
          <FaArrowUp />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            moveDown(obj);
          }}
          className="px-1 py-0.5 border rounded text-xs"
        >
          <FaArrowDown />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleVisibility(obj);
          }}
          className="px-1 py-0.5 border rounded text-xs"
        >
          {obj.visible ? <FaEye /> : <FaEyeSlash />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLock(obj);
          }}
          className="px-1 py-0.5 border rounded text-xs"
        >
          {obj.selectable ? <FaLockOpen /> : <FaLock />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteObject(obj);
          }}
          className="px-1 py-0.5 border rounded text-xs text-red-500"
        >
          <FaTrash />
        </button>
      </div>
    </li>
  );
}

export default function LayersPanel({ canvas }) {
  const [objects, setObjects] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!canvas) return;

    // Give each object a unique id for DnD
    canvas.getObjects().forEach((obj) => {
      if (!obj.__uid) obj.__uid = Math.random().toString(36).substr(2, 9);
    });

    const updateLayers = () => {
      setObjects([...canvas.getObjects()].reverse());
      setActiveId(canvas.getActiveObject());
    };

    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);
    canvas.on("object:modified", updateLayers);
    updateLayers();

    return () => {
      if (canvas.off) {
        canvas.off("object:added", updateLayers);
        canvas.off("object:removed", updateLayers);
        canvas.off("object:modified", updateLayers);
      }
    };
  }, [canvas]);

  const selectObject = (obj) => {
    canvas.setActiveObject(obj);
    canvas.renderAll();
    setActiveId(obj);
  };

  const toggleVisibility = (obj) => {
    obj.visible = !obj.visible;
    canvas.renderAll();
    setObjects([...canvas.getObjects()].reverse());
  };

  const toggleLock = (obj) => {
    obj.selectable = !obj.selectable;
    obj.evented = obj.selectable;
    canvas.renderAll();
    setObjects([...canvas.getObjects()].reverse());
  };

  const deleteObject = (obj) => {
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const moveUp = (obj) => {
    canvas.bringForward(obj);
    canvas.renderAll();
    setObjects([...canvas.getObjects()].reverse());
  };

  const moveDown = (obj) => {
    canvas.sendBackwards(obj);
    canvas.renderAll();
    setObjects([...canvas.getObjects()].reverse());
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return;

    if (active.id !== over.id) {
      const oldIndex = objects.findIndex((obj) => obj.__uid === active.id);
      const newIndex = objects.findIndex((obj) => obj.__uid === over.id);

      const newObjects = arrayMove(objects, oldIndex, newIndex);
      setObjects(newObjects);

      // Update canvas stacking
      newObjects
        .slice()
        .reverse()
        .forEach((obj, i) => {
          canvas.moveTo(obj, i);
        });
      canvas.renderAll();
    }
  };

  return (
    <div className="py-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Layers</h3>
      {!canvas ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : objects.length === 0 ? (
        <p className="text-sm text-gray-500">No layers yet</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={objects.map((obj) => obj.__uid)}
            strategy={verticalListSortingStrategy}
          >
            <ul>
              {objects.map((obj, index) => (
                <LayerItem
                  key={`${obj.type}-${index}`}
                  obj={obj}
                  selectObject={selectObject}
                  moveUp={moveUp}
                  moveDown={moveDown}
                  toggleVisibility={toggleVisibility}
                  toggleLock={toggleLock}
                  deleteObject={deleteObject}
                  activeId={activeId}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
