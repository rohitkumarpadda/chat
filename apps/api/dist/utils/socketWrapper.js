"use strict";
//A middleware wrapper to use express middleware with socket.io
//See: https://socket.io/docs/v4/middlewares/#compatibility-with-express-middleware
exports.__esModule = true;
exports.socketWrapper = void 0;
var socketWrapper = function (middleware) {
    return function (socket, next) { return middleware(socket.request, {}, next); };
};
exports.socketWrapper = socketWrapper;
