import Navbar from "@/components/Navbar";
import LookbookItem from "@/components/shop/LookbookItem";
import { looks } from "@/data/looks";

export default function LookbookPage() {
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
        {looks.map((look) => (
          <LookbookItem key={look.id} {...look} />
        ))}
      </div>
    </main>
  );
}
