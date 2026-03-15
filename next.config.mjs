/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração Standalone para Docker
  output: "standalone",

  // Nova localização da chave no Next.js 16+
  reactCompiler: true,

  compiler: {
    // Mantido para suporte ao styled-components (SWC)
    styledComponents: true,
  },

  // Redireciona links antigos para a API de arquivos e contorna o cache do standalone
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/uploads/:path*",
          destination: "/api/files/:path*",
        },
      ],
    };
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
