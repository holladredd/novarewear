import { useState } from "react";
import Navbar from "@/components/Navbar";
import { products } from "@/data/products";
import Link from "next/link";

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Tees", "Hoodies", "Pants", "Accessories"];

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter = filter === "All" || product.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 pt-32">
        <h1 className="text-4xl md:text-5xl font-bold tracking-widest mb-8 text-center">
          Shop Collection
        </h1>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-12">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-black px-4 py-2 w-full md:w-1/3 text-sm tracking-widest focus:outline-none"
          />

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm tracking-widest border ${
                  filter === cat ? "bg-black text-white" : "border-black"
                } hover:bg-black hover:text-white transition`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative">
              <Link href={`/shop/${product.slug}`}>
                <div className="cursor-pointer">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="mt-4 flex flex-col items-start">
                    <h2 className="text-lg font-semibold tracking-widest">
                      {product.name}
                    </h2>
                    <p className="text-sm tracking-widest opacity-70">
                      {product.price}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
