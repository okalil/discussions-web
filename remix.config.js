const path = require('path');
const { routeExtensions } = require('remix-custom-routes');

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  serverModuleFormat: 'cjs',
  async routes() {
    const appDirectory = path.join(__dirname, 'app');
    return routeExtensions(appDirectory);
  },
};
