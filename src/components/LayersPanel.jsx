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
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ---------- sortable item ---------- */
function LayerItem({
  obj,
  selectObject,
  setObjects,
  toggleVisibility,
  toggleLock,
  deleteObject,
  activeId,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: obj.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: obj.id === activeId ? "2px solid #2563eb" : "1px solid transparent",
  };
  // const bringForward = () =>
  //   setObjects((o) => {
  //     const idx = o.findIndex((x) => x.id === selectedId);
  //     if (idx === -1 || idx === o.length - 1) return o;
  //     const next = [...o];
  //     [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
  //     return next;
  //   });

  // const sendBackwards = () =>
  //   setObjects((o) => {
  //     const idx = o.findIndex((x) => x.id === selectedId);
  //     if (idx <= 0) return o;
  //     const next = [...o];
  //     [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
  //     return next;
  //   });
  return (
    <li
      ref={setNodeRef}
      style={style}
      className="p-2 mb-2 bg-white rounded shadow-sm flex justify-between items-center cursor-pointer"
      onClick={() => selectObject(obj.id)} // row click = select
    >
      {/* drag handle = layer name */}
      <span
        className="capitalize cursor-move"
        {...attributes}
        {...listeners} // ONLY here
      >
        {obj.type}
      </span>

      {/* buttons – NO listeners */}
      <div className="flex space-x-1">
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            bringForward(obj.id);
          }}
          className="px-1 py-0.5 border rounded text-xs"
        >
          <FaArrowUp />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            sendBackwards(obj.id);
          }}
          className="px-1 py-0.5 border rounded text-xs"
        >
          <FaArrowDown />
        </button> */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleVisibility(obj.id);
          }}
          className="px-1 py-0.5 border rounded text-xs"
        >
          {obj.visible ? <FaEye /> : <FaEyeSlash />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLock(obj.id);
          }}
          className="px-1 py-0.5 border rounded text-xs"
        >
          {obj.draggable ? <FaLockOpen /> : <FaLock />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteObject(obj.id);
          }}
          className="px-1 py-0.5 border rounded text-xs text-red-500"
        >
          <FaTrash />
        </button>
      </div>
    </li>
  );
}

/* ---------- main panel ---------- */
export default function LayersPanel({
  objects,
  setObjects,
  selectedId,
  setSelectedId,
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  const selectObject = (id) => setSelectedId(id);

  const toggleVisibility = (id) =>
    setObjects((o) =>
      o.map((x) => (x.id === id ? { ...x, visible: !x.visible } : x))
    );

  const toggleLock = (id) =>
    setObjects((o) =>
      o.map((x) => (x.id === id ? { ...x, draggable: !x.draggable } : x))
    );

  const deleteObject = (id) => setObjects((o) => o.filter((x) => x.id !== id));

  const moveUp = (id) => {
    const idx = objects.findIndex((o) => o.id === id);
    if (idx === -1 || idx === objects.length - 1) return;
    setObjects(arrayMove(objects, idx, idx + 1));
  };

  const moveDown = (id) => {
    const idx = objects.findIndex((o) => o.id === id);
    if (idx <= 0) return;
    setObjects(arrayMove(objects, idx, idx - 1));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;
    const oldIndex = objects.findIndex((o) => o.id === active.id);
    const newIndex = objects.findIndex((o) => o.id === over.id);
    setObjects(arrayMove(objects, oldIndex, newIndex));
  };

  return (
    <div className="py-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Layers</h3>
      {objects.length === 0 ? (
        <p className="text-sm text-gray-500">No layers yet</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={objects.map((obj) => obj.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul>
              {objects.map((obj) => (
                <LayerItem
                  key={obj.id}
                  obj={obj}
                  selectObject={selectObject}
                  moveUp={moveUp}
                  moveDown={moveDown}
                  toggleVisibility={toggleVisibility}
                  toggleLock={toggleLock}
                  deleteObject={deleteObject}
                  activeId={selectedId}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
