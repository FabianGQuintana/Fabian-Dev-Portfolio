import createNextIntlPlugin from "next-intl/plugin";

import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Cabeceras de seguridad aplicadas a todas las rutas.
 * Se definen aqui, en un solo lugar, en vez de repetirlas por ruta.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
] as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Oculta el indicador flotante "N" de Next.js en desarrollo.
  devIndicators: false,

  // Turbopack no deduce bien el root cuando el repo vive bajo un path
  // sincronizado (p.ej. OneDrive): lo fijamos al directorio del proyecto
  // para que encuentre package-lock.json sin warnings.
  turbopack: { root: __dirname },

  // En `next dev`, Next bloquea los recursos de desarrollo (JS, HMR) pedidos
  // desde otro origen que no sea localhost. Permitimos las IPs de red local
  // para poder probar el sitio desde el celular conectado al mismo Wi-Fi
  // (http://<IP-de-la-PC>:3000). No afecta al build de produccion.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "26.*.*.*"],

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
    ],
  },

  async headers() {
    return [{ source: "/:path*", headers: [...securityHeaders] }];
  },
};

export default withNextIntl(nextConfig);
