// hooks/useClipFunc.js
import { useCallback } from "react";

// This hook is always called, but returns a no-op if clipObject is null
export const useClipFunc = (clipObject, shapeProps) => {
  // The hook itself is called unconditionally on every render
  // Only the callback inside conditionally uses clipObject

  return useCallback(
    (ctx) => {
      // Early return if no clipObject - this is safe INSIDE the callback
      if (!clipObject) {
        return;
      }

      const shapeX = shapeProps?.x || 0;
      const shapeY = shapeProps?.y || 0;
      const shapeScaleX = shapeProps?.scaleX || 1;
      const shapeScaleY = shapeProps?.scaleY || 1;

      const clipX = clipObject.x || 0;
      const clipY = clipObject.y || 0;
      const clipWidth = clipObject.width || 100;
      const clipHeight = clipObject.height || 100;

      // Transform to local coordinates
      const localX = (clipX - shapeX) / shapeScaleX;
      const localY = (clipY - shapeY) / shapeScaleY;
      const localWidth = clipWidth / shapeScaleX;
      const localHeight = clipHeight / shapeScaleY;

      console.log(
        `[ClipFunc] Clipping to: (${localX}, ${localY}) ${localWidth}x${localHeight}`
      );

      ctx.save();
      ctx.beginPath();
      ctx.rect(localX, localY, localWidth, localHeight);
      ctx.clip();
      ctx.restore();
    },
    // Stable dependency array
    [
      clipObject?.id,
      shapeProps?.x,
      shapeProps?.y,
      shapeProps?.scaleX,
      shapeProps?.scaleY,
    ]
  );
};
