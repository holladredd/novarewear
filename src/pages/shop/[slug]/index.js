import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { products } from "@/data/products";
import Link from "next/link";

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <Navbar />
        <h1 className="text-2xl tracking-[0.3em] uppercase">
          Product Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover"
          />
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-widest">
              {product.name}
            </h1>
            <p className="text-xl tracking-widest opacity-80">
              {product.price}
            </p>
            <p className="text-sm tracking-wider leading-relaxed">
              This is a placeholder description for the {product.name}. Custom
              details about the fabric, fit, and design would go here.
            </p>
            <div className="flex gap-4 mt-4">
              <button className="w-full bg-black text-white py-3 tracking-widest hover:bg-gray-800 transition">
                Add to Cart
              </button>
              {product.lookbookId && (
                <Link
                  href={`/lookbook#look-${product.lookbookId}`}
                  className="w-full border border-black text-center py-3 tracking-widest hover:bg-gray-200 transition"
                >
                  View in Lookbook
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
