const TemplateColorEditor = ({ color, onChange }) => (
  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">Board Colour</h3>
    <input
      type="color"
      value={color}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 rounded cursor-pointer border-none"
    />
  </div>
);
