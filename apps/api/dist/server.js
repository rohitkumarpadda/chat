"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
require("~/config/dotenv");
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var http_1 = __importDefault(require("http"));
var connectToDb_1 = require("~/utils/connectToDb");
var socket_io_1 = require("socket.io");
var routes_1 = __importDefault(require("~/routes"));
var passport_1 = require("~/config/passport");
var passport_2 = __importDefault(require("passport"));
var socketWrapper_1 = require("./utils/socketWrapper");
var socket_1 = require("./socket");
var app = (0, express_1["default"])();
var port = process.env.PORT || 3001;
var server = http_1["default"].createServer(app);
(0, passport_1.configurePassport)(app);
var corsConfig = {
    credentials: true,
    origin: true
};
app.use((0, cors_1["default"])(corsConfig));
app.use(body_parser_1["default"].json());
app.use((0, cookie_parser_1["default"])());
// Routes
app.use('/api/v1', routes_1["default"]); //Call api in e.g. http://localhost:3001/api/example
//use passport middleware for authentication in socket.io
//Here we connect to our mongo database
(0, connectToDb_1.connectToDb)().then(function () {
    console.log('Database connected');
    //Start the server
    server.listen(port, function () {
        console.log("[server]: Server is running at https://0.0.0.0:".concat(port));
    });
});
/**
 * Socket.io server setup
 */
var io = new socket_io_1.Server(server, {
    cookie: true,
    cors: {
        origin: '*',
        credentials: true
    }
});
io.use((0, socketWrapper_1.socketWrapper)(passport_2["default"].initialize()));
//Where here we protect our socket.io routes, we add a JWT middleware
//Actually, we could use our own socketAuthMiddleware, it is the same
io.use((0, socketWrapper_1.socketWrapper)(passport_2["default"].authenticate('jwt', { session: false })));
// //Where here we protect our socket.io routes
// io.use(socketAuthMiddleware);
io.on('connection', function (socket) { return (0, socket_1.handleSocketEvents)(socket, io); });
exports["default"] = server;
