"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LookbookItem({ image, title, subtitle, shopLink }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative w-full h-[90vh] overflow-hidden"
    >
      {/* Image */}
      <Image src={image} alt={title} fill priority className="object-cover" />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Text Content */}
      <div className="absolute bottom-20 left-8 md:left-20 max-w-xl text-white">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl md:text-4xl tracking-[0.3em] uppercase"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          transition={{ delay: 0.4 }}
          className="mt-5 text-sm tracking-[0.35em] uppercase"
        >
          {subtitle}
        </motion.p>

        {/* Shop link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10"
        >
          <Link
            href={shopLink}
            className="inline-block border border-white px-10 py-3 text-xs tracking-[0.4em] uppercase hover:bg-white hover:text-black transition"
          >
            Shop This Look
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
