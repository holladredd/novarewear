import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const values = [
    {
      title: "Quality",
      description:
        "Premium fabrics, precise tailoring, attention to every detail.",
    },
    {
      title: "Innovation",
      description:
        "Modern designs that push boundaries while staying wearable.",
    },
    {
      title: "Sustainability",
      description:
        "Thoughtful sourcing and eco-conscious practices for a better future.",
    },
  ];

  return (
    <section className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <motion.div
        className="max-w-full mx-auto px-6 py-40 flex flex-col gap-16"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Hero Section */}
        <motion.div variants={item} className="text-center">
          <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] mb-4">
            About NØVÁRE
          </h1>
          <p className="text-sm md:text-base tracking-[0.3em] uppercase opacity-60">
            Nothing Ordinary
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div variants={item} className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <p className="text-lg md:text-xl leading-relaxed text-gray-800">
              At <span className="font-semibold">NØVÁRE</span>, we believe in
              creating apparel that defies the ordinary. Our collections are
              inspired by modern luxury and timeless design, blending
              craftsmanship with unique aesthetics.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-gray-800">
              Each piece is carefully designed to elevate everyday style while
              staying true to our philosophy:{" "}
              <span className="italic">Nothing Ordinary</span>.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="/lookbook/look-1.jpg"
              alt="NOVARE Collection"
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div variants={item} className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="text-center p-8 border border-gray-100 hover:border-gray-300 transition-colors"
            >
              <h3 className="text-xl font-light tracking-widest mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={item} className="text-center">
          <Link
            href="/shop"
            className="inline-block px-10 py-3 border border-black text-sm tracking-widest hover:bg-black hover:text-white transition"
          >
            SHOP COLLECTION
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
