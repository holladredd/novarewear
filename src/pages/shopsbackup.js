import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

const products = [
  {
    id: 1,
    name: "Classic T-Shirt",
    price: 25,
    imageUrl: "/products/t-shirt.svg",
  },
  {
    id: 2,
    name: "Denim Jeans",
    price: 75,
    imageUrl: "/products/jeans.svg",
  },
  {
    id: 3,
    name: "Hoodie",
    price: 50,
    imageUrl: "/products/hoodie.svg",
  },
];

export default function Shop() {
  return (
    <>
      <Navbar />
      <div className="p-10 grid grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
