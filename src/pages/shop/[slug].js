import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "@/contexts/ProductContext";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { fetchProductBySlug } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (isError)
    return (
      <div className="text-center py-12 text-red-500">
        Error loading product.
      </div>
    );
  if (!product) return null;

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-widest mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold tracking-widest mb-4">
              ${product?.price?.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
              <div className="flex items-center gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`px-4 py-2 text-sm tracking-widest border ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "border-black"
                    } hover:bg-black hover:text-white transition`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20 border border-black px-3 py-2 text-center"
              />
              <button className="w-full bg-black text-white py-3 px-6 font-bold tracking-widest hover:bg-gray-800 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        {product.lookImages && product.lookImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold tracking-widest mb-6 text-center">
              How to Wear It
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.lookImages.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg">
                  <img
                    src={image}
                    alt={`Look ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
