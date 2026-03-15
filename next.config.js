/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Impede que o servidor de desenvolvimento reinicie a cada novo upload.
    // O reinício invalida os Server Actions no cliente e causa o erro "Failed to find Server Action".
    config.watchOptions.ignored.push("**/public/uploads/**");
    return config;
  },
};

module.exports = nextConfig;
