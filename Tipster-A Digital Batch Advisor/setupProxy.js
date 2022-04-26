const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware(require("./routers/auth"),{
      target: 'http://localhost:6000',
      changeOrigin: true,
    })
  );
};