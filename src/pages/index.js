import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="font-sans text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-50">
        {/* <div className="absolute inset-0">
          <Image
            src="/hero/hero-bg.webp" // Replace with your hero image
            alt="NØVÁRE Hero"
            layout="fill"
            objectFit="cover"
            className="opacity-80"
          />
        </div> */}

        <motion.div
          className="relative z-10 text-center px-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Brand Name */}

          <motion.img
            variants={item}
            src="/logo/novare-wordmark.svg"
            alt="NØVÁRE"
            className="w-full h-auto"
          />

          {/* Divider */}
          <motion.div
            variants={item}
            className="w-24 h-px bg-black mx-auto my-8 opacity-50"
          />

          {/* Slogan */}
          <motion.p
            variants={item}
            className="text-sm md:text-base tracking-[0.4em] uppercase opacity-80 text-gray-900"
          >
            Nothing Ordinary
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={item}
            className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border border-gray-900 text-sm tracking-widest hover:bg-gray-900 hover:text-white transition"
            >
              <Link href="/shop">Shop Collection</Link>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 text-sm tracking-widest opacity-70 hover:opacity-100 transition text-gray-900"
            >
              <Link href="/lookbook">View Lookbook</Link>
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Featured Collection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            "/products/hoodie-1.jpg",
            "/products/pants-1.jpg",
            "/products/tee-1.jpg",
          ].map((img, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                src={img}
                alt={`Product ${idx + 1}`}
                width={400}
                height={500}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-gray-900 p-4 text-center">
                Product {idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lookbook Teaser */}
      <section className="relative h-[60vh] my-20 flex items-center justify-center">
        <Image
          src="/lookbook/look-1.jpg"
          alt="Lookbook"
          layout="fill"
          objectFit="cover"
          className="opacity-70"
        />
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Explore the Lookbook
          </h2>
          <Link
            href="/lookbook"
            className="inline-block bg-white text-black py-2 px-6 uppercase tracking-widest text-sm md:text-base hover:bg-gray-200 transition"
          >
            View Lookbook
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
