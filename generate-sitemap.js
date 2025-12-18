const fs = require("fs");
const { globby } = require("globby");
const { products } = require("./src/data/products");

async function generateSitemap() {
  const pages = await globby([
    "src/pages/**/*.js",
    "!src/pages/_*.js",
    "!src/pages/api",
    "!src/pages/shop/[slug]/index.js",
  ]);

  const productPages = products.map((product) => `/shop/${product.slug}`);

  const allPages = [
    ...pages.map((page) =>
      page.replace("src/pages", "").replace(".js", "").replace("/index", "")
    ),
    ...productPages,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map((page) => {
    const path = page === "" ? "/" : page;
    return `
  <url>
    <loc>${`https://novarewear.vercel.app${path}`}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  })
  .join("")}
</urlset>`;

  fs.writeFileSync("public/sitemap.xml", sitemap);
}

generateSitemap();
