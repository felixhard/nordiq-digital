/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
    compress: true,
    poweredByHeader: false,
    webpack(config) {
      // Find the existing rule that handles SVG imports
      const fileLoaderRule = config.module.rules.find((rule) =>
        rule.test?.test?.('.svg')
      );
  
      // Update the rules to handle SVG files
      config.module.rules.push(
        // Reapply the existing rule, but only for SVG imports ending in ?url
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // *.svg?url
        },
        // Convert all other *.svg imports to React components
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [...(fileLoaderRule.resourceQuery?.not || []), /url/] }, // Exclude *.svg?url
          use: ['@svgr/webpack'],
        }
      );
  
      // Exclude SVGs from the default file loader rule
      fileLoaderRule.exclude = /\.svg$/i;
  
      return config;
    },
};
  
export default nextConfig;
  