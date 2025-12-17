import { useRef, useState } from "react";
import { FaImage } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function AddImageButton({ onImageAdd }) {
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handlePick = () => fileRef.current?.click();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // block SVG
    if (
      file.type === "image/svg+xml" ||
      file.name.toLowerCase().endsWith(".svg")
    ) {
      alert("SVG not allowed. Please choose JPG, PNG, WebP, BMP or GIF.");
      e.target.value = ""; // reset input
      return;
    }

    setLoading(true);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      onImageAdd({
        id: uuid(),
        type: "image",
        imageUrl: url,
        x: 200,
        y: 200,
        width: img.naturalWidth || 300,
        height: img.naturalHeight || 300,
        visible: true,
        draggable: true,
      });
      setLoading(false);
      e.target.value = ""; // allow re-adding same file
    };
    img.src = url;
  };

  return (
    <div className="relative">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/bmp,image/gif"
        onChange={handleFile}
        className="absolute inset-0 w-0 h-0 opacity-0"
      />
      <button
        onClick={handlePick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 active:bg-gray-200 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02]"
      >
        <IoCloudUploadOutline size={24} />
      </button>
    </div>
  );
}
