// proxy-server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const FE_PORT = process.env.FE_PORT || 5151;
const BE_PORT = process.env.BE_PORT || 5252;

app.use('/fe', createProxyMiddleware({
  target: `http://localhost:${FE_PORT}`,
  pathRewrite: { '^/fe': '' },
  changeOrigin: true
}));

app.use('/be', createProxyMiddleware({
  target: `http://localhost:${BE_PORT}`,
  pathRewrite: { '^/be': '' },
  changeOrigin: true
}));

app.listen(5353, () => {
  console.log(`Proxy running on http://localhost:5353`);
  console.log(`→ Frontend available at http://localhost:5353/fe`);
  console.log(`→ Backend  available at http://localhost:5353/be`);
});
