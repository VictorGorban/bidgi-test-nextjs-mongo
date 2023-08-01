// файл для запуска dev-версий и теста
const nextBuildId = require("next-build-id");

const {
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} = require("next/constants");

module.exports = (phase) => {
  let distDir = "build-dev";
  if (phase == PHASE_PRODUCTION_BUILD) {
    distDir = "build";
  } else if (phase == PHASE_PRODUCTION_SERVER) {
    distDir = "build-public";
  }

  return {
    reactStrictMode: true,
    basePath: "",
    distDir, // dir to build to, and serve from. Next.js takes distDir as target directory when 'next build', and does the same when 'next start'.

    generateBuildId: () => nextBuildId({ dir: __dirname }),
    experimental: {
      images: {
        allowFutureImage: true,
      },
    },

    // async rewrites() {
    //   return [
    //     {
    //       source: '/item/[id]',
    //       destination: '/item?id=[id]',
    //     },
    //   ]
    // },

  };
};
