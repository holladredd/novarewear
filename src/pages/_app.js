import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/amatic-sc";
import "@fontsource/anton";
import "@fontsource/arimo";
import "@fontsource/bebas-neue";
import "@fontsource/caveat";
import "@fontsource/cormorant";
import "@fontsource/dancing-script";
import "@fontsource/eb-garamond";
import "@fontsource/fauna-one";
import "@fontsource/fjalla-one";
import "@fontsource/indie-flower";
import "@fontsource/josefin-sans";
import "@fontsource/lato";
import "@fontsource/limelight";
import "@fontsource/lobster";
import "@fontsource/merriweather";
import "@fontsource/monoton";
import "@fontsource/montserrat";
import "@fontsource/noto-sans";
import "@fontsource/open-sans";
import "@fontsource/oswald";
import "@fontsource/pt-sans";
import "@fontsource/pacifico";
import "@fontsource/philosopher";
import "@fontsource/playfair-display";
import "@fontsource/poppins";
import "@fontsource/quicksand";
import "@fontsource/raleway";
import "@fontsource/roboto";
import "@fontsource/slabo-27px";
import "@fontsource/source-sans-pro";
import "@fontsource/teko";
import "@fontsource/trirong";
import "@fontsource/ubuntu";
import "@fontsource/unifrakturmaguntia";
import "@fontsource/varela-round";
import "@fontsource/yanone-kaffeesatz";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
