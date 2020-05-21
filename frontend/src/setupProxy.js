const {createProxyMiddleware} = require('http-proxy-middleware');

console.log('lrhhhh' + process.env.NODE_ENV);

process.env.NODE_ENV === 'production' ?
    module.exports = function (app) {
        app.use(
            "/api",
            createProxyMiddleware({
                target: "http://backend:5000/",
                changeOrigin: true
            })
        );
        app.use(
            "/auth",
            createProxyMiddleware({
                target: "http://backend:5000/",
                changeOrigin: true
            })
        );
    }
    :
    module.exports = function (app) {
        app.use(
            "/api",
            createProxyMiddleware({
                target: "http://localhost:5000/",
                changeOrigin: true
            })
        );
        app.use(
            "/auth",
            createProxyMiddleware({
                target: "http://localhost:5000/",
                changeOrigin: true
            })
        );
    };



