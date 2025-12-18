import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative w-full aspect-[3/4] bg-[#EDEDED] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* Info */}
      <div className="mt-4 text-center">
        <p className="text-sm tracking-widest uppercase">{product.name}</p>
        <p className="mt-1 text-sm opacity-60">₦{product.price}</p>
      </div>
    </div>
  );
}
