import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/logo/novare.svg" sizes="any" />
        <title>NØVÁRE</title>
        <meta name="description" content="Nothing Ordinary." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NØVÁRE" />
        <meta
          property="og:image"
          content="https://novarewear.vercel.app/novare.jpg"
        />
        <meta
          name="twitter:image"
          content="https://novarewear.vercel.app/novare.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="canonical" href="https://novarewear.vercel.app" />
        <meta name="author" content="NØVÁRE Group" />
        <meta
          name="keywords"
          content="NØVÁRE, Novare, clothing, fashion, streetwear, minimalist, modern, lookbook, shop, high-quality apparel,hoodies,urban wear,luxury fashion, contemporary clothing, stylish apparel, trendy outfits, casual wear, fashion brand, unique designs, exclusive collections, premium quality, fashion trends, clothing line, designer wear, fashion essentials"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
