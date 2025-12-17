// utils/svgParser.js
export async function parseSVG(svgUrl) {
  console.log(`[SVG Parser] Processing: ${svgUrl}`);

  try {
    const response = await fetch(svgUrl);
    const svgText = await response.text();

    // Try to extract path data
    const pathMatch = svgText.match(/<path[^>]*d="([^"]*)"[^>]*>/i);
    if (pathMatch) {
      return {
        type: "path",
        data: pathMatch[1],
        // Try to get viewBox or dimensions
        viewBox: svgText.match(/viewBox="([^"]*)"/i)?.[1],
        width: svgText.match(/width="([^"]*)"/i)?.[1],
        height: svgText.match(/height="([^"]*)"/i)?.[1],
      };
    }

    // If no path, check if it has image elements
    const imageMatch = svgText.match(/<image[^>]*href="([^"]*)"[^>]*>/i);
    if (imageMatch) {
      return {
        type: "image",
        src: imageMatch[1],
      };
    }

    // Fallback: return full SVG as data URL
    return {
      type: "svg-data",
      data: `data:image/svg+xml;base64,${btoa(svgText)}`,
    };
  } catch (error) {
    console.error("[SVG Parser] Fatal error:", error);
    return null;
  }
}
