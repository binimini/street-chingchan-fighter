const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    createProxyMiddleware("/socket.io", {
      target: "http://localhost:8000",
      changeOrigin: true,
      //ws: true,
    })
  );
};
