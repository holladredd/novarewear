import Image from "next/image";
import AddImageButton from "./AddImageButton";

export default function TemplatePanel({ onSelectTemplate, setObjects }) {
  const templates = [
    {
      name: "Long Sleeve Hoodie",
      path: "/templates/vecteezy_long-sleeve-hoodie-technical-fashion-flat-sketch-vector_9649450.svg",
    },
    {
      name: "Long Sleeve Jacket",
      path: "/templates/vecteezy_long-sleeve-jacket-technical-fashion-flat-sketch-vector_7494901.svg",
    },
    {
      name: "Jacket with Pocket",
      path: "/templates/vecteezy_long-sleeve-jacket-with-pocket-and-zipper-technical-fashion_19849444.svg",
    },
    {
      name: "Jacket Sweatshirt",
      path: "/templates/vecteezy_long-sleeve-with-zipper-and-pocket-jacket-sweatshirt_11387650.svg",
    },
    {
      name: "Polo Shirt",
      path: "/templates/vecteezy_polo-shirt-vector-illustration-template-front-and-back_6896922.svg",
    },
  ];

  return (
    <div className="p-4 bg-gray-100 text-gray-600 rounded-xl border border-gray-200 shadow-2xl">
      <h3 className="text-lg font-semibold mb-4 tracking-wide">
        Choose Template
      </h3>

      {/* sleek cards */}
      <div className="grid grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-1">
        {templates.map((t) => (
          <div
            key={t.name}
            onClick={() => onSelectTemplate(t.path)}
            className="group relative rounded-xl overflow-hidden border border-gray-200 hover:border-blue-400 transition-all duration-300 transform hover:scale-[1.03] cursor-pointer"
          >
            <img
              src={t.path}
              alt={t.name}
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-700 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute bottom-2 left-2 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {t.name}
            </span>
          </div>
        ))}
      </div>

      {/* raster-only add button */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <AddImageButton
          onImageAdd={(newImage) => setObjects((o) => [...o, newImage])}
        />
      </div>
    </div>
  );
}
