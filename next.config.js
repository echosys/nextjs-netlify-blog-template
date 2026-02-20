const { execSync } = require('child_process');

module.exports = {
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toLocaleString(),
    NEXT_PUBLIC_GIT_COMMIT: execSync('git rev-parse --short HEAD').toString().trim(),
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
