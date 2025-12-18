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
        <meta property="og:image" content="/logo/novare.jpg" />
        <meta name="twitter:image" content="/logo/novare.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
