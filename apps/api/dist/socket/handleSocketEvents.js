"use strict";
exports.__esModule = true;
exports.handleSocketEvents = void 0;
var jwt_1 = require("~/utils/jwt");
//key value pair of  user id and socket.id
var users = {};
var addUser = function (socketId, userId) {
    users[socketId] = userId;
};
var removeUser = function (socketId) {
    delete users[socketId];
};
var handleSocketEvents = function (socket, io) {
    //Handle connected
    handleConnectEvent(socket, io);
    //chat
    socket.on("sendMessage", function (receivedPayload) {
        var receiverId = receivedPayload.receiverId, content = receivedPayload.content, senderContent = receivedPayload.senderContent, conversationId = receivedPayload.conversationId;
        console.log("[socket]: sendMessage: " + content);
        var senderId = users[socket.id]; //Get the sender id from the users object
        console.log("[sendMessage]: senderId: " + senderId, "receiverId: " + receiverId);
        //Send the message to the receiver
        for (var socketId in users) {
            if (users[socketId] === receiverId) {
                console.log("[sendMessage ok] Private message to: " + receiverId);
                //Where we find the receiver socket id, we send the message
                socket.to(socket.id).to(socketId).emit("getMessage", {
                    senderId: senderId,
                    senderContent: senderContent,
                    content: content,
                    conversationId: conversationId
                });
            }
        }
        // io.emit("sendMessage", `${socket.id} said ${msg}`);
    });
    socket.on("disconnect", function () { return handleDisconnectEvent(socket); });
};
exports.handleSocketEvents = handleSocketEvents;
var handleDisconnectEvent = function (socket) {
    console.log("user disconnect ".concat(socket.id));
    //Remove the user from the users object
    removeUser(socket.id);
    console.log("[socket] users:", users);
};
var handleConnectEvent = function (socket, io) {
    var _a;
    //Verify and decode the JWT from the bearer header
    var token = (0, jwt_1.verifyJWT)(((_a = socket.handshake.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || "");
    if (token) {
        console.log("user connected: ".concat(socket.id, " ").concat(token.user.id));
        //   console.log("[handleConnectEvent]: ", token);
        //Store the user id and socket id in the users object
        addUser(socket.id, token.user.id);
        console.log("[socket] users:", users);
    }
    else {
        console.log("[socket]: unauthorized");
        io.emit("exception", {
            message: "Unauthorized"
        });
        socket.disconnect();
    }
};
