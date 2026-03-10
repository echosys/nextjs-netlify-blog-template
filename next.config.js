const { execSync } = require('child_process');

let gitCommit = 'local';
try { gitCommit = execSync('git rev-parse --short HEAD').toString().trim(); } catch {}

module.exports = {
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toLocaleString(),
    NEXT_PUBLIC_GIT_COMMIT: gitCommit,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000',
  },
  pageExtensions: ["tsx", "ts"],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push(
      {
        test: /\.yml$/,
        use: "yaml-loader",
      },
      {
        test: /\.svg$/,
        use: "@svgr/webpack",
      }
    );
    return config;
  },
};
