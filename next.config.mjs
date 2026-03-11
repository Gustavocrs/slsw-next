/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gera o build otimizado para Docker (node server.js)
  output: "standalone",

  compiler: {
    // Habilita suporte nativo do SWC para styled-components
    styledComponents: true,
  },

  experimental: {
    // Habilita o novo React Compiler para otimização de hooks e memoização
    reactCompiler: true,
  },

  // Configurações de Headers (CORS)
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {key: "Access-Control-Allow-Credentials", value: "true"},
          {key: "Access-Control-Allow-Origin", value: "*"},
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
