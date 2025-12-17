// utils/svg.js

export async function getPathData(svgUrl) {
  console.log(`[SVG Parser] Loading: ${svgUrl}`);

  try {
    const response = await fetch(svgUrl);
    const svgText = await response.text();

    console.log(`[SVG Parser] Raw SVG length: ${svgText.length} chars`);

    // Extract ALL path elements
    const pathMatches = svgText.match(/<path\s+[^>]*d="([^"]*)"[^>]*>/g);

    if (!pathMatches) {
      console.warn("[SVG Parser] No path elements found in SVG");
      return null;
    }

    console.log(`[SVG Parser] Found ${pathMatches.length} path elements`);

    // Combine all path data into one path
    const allPaths = pathMatches
      .map((match, i) => {
        const d = match.match(/d="([^"]*)"/)[1];
        console.log(`[SVG Parser] Path ${i}: ${d.substring(0, 50)}...`);
        return d;
      })
      .join(" ");

    console.log(`[SVG Parser] Combined path length: ${allPaths.length}`);
    return allPaths;
  } catch (error) {
    console.error("[SVG Parser] Error:", error);
    return null;
  }
}

// Add function to render SVG as image for debugging
export function createSVGImage(svgUrl) {
  const img = new Image();
  img.onload = () => {
    console.log(`[SVG Image] Loaded: ${img.naturalWidth}x${img.naturalHeight}`);
  };
  img.onerror = (e) => {
    console.error(`[SVG Image] Failed to load: ${svgUrl}`, e);
  };
  img.src = svgUrl;
  return img;
}
