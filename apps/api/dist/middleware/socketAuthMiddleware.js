"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.socketAuthMiddleware = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var jwt_1 = require("~/utils/jwt");
var interfaces_1 = require("interfaces");
var socketAuthMiddleware = function (socket, next) {
    var authenticated = false;
    if (socket.request.headers.authorization) {
        //Get bearer token from authorization header
        var token = socket.request.headers.authorization.split(" ")[1];
        try {
            //Verify token
            var decoded = jsonwebtoken_1["default"].verify(token, (0, jwt_1.getJWTPublicKey)(), {
                algorithms: ["RS256"]
            });
            if (decoded) {
                authenticated = true;
            }
        }
        catch (e) {
            authenticated = false;
        }
    }
    //If the user not authenticated, throw error
    if (authenticated) {
        return next();
    }
    console.log("[Socket Auth]: User not authenticated");
    socket.emit("error", interfaces_1.SocketError.ERR_UNAUTHORIZED);
    return next(new Error(interfaces_1.SocketError.ERR_UNAUTHORIZED));
};
exports.socketAuthMiddleware = socketAuthMiddleware;
