import Navbar from "@/components/Navbar";
import LookbookItem from "@/components/shop/LookbookItem";
import { useProducts } from "@/contexts/ProductContext";
import { useQuery } from "@tanstack/react-query";

export default function LookbookPage() {
  const { fetchLookbook } = useProducts();

  const {
    data: looks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lookbook"],
    queryFn: fetchLookbook,
  });

  return (
    <main className="w-full bg-black ">
      <Navbar />
      {/* Intro */}
      <section className="px-6 py-40 max-w-5xl mx-auto text-center text-white">
        <h1 className="text-4xl md:text-5xl tracking-[0.4em] uppercase">
          Lookbook
        </h1>
        <p className="mt-10 text-xs tracking-[0.4em] uppercase opacity-60">
          A Visual Story by NOVARE
        </p>
      </section>

      {/* Looks */}
      <div className="space-y-40 text-white">
        {isLoading && <p className="text-center">Loading...</p>}
        {isError && (
          <p className="text-center text-red-500">Error loading looks.</p>
        )}
        {looks?.map((product) => (
          <LookbookItem
            key={product._id}
            image={product.lookImages[0]}
            title={product.name}
            subtitle={product.category}
            shopLink={`/shop/${product.slug}`}
          />
        ))}
      </div>
    </main>
  );
}
