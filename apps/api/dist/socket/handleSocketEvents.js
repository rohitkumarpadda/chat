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
    socket.on('sendMessage', function (receivedPayload) {
        var receiverId = receivedPayload.receiverId, content = receivedPayload.content, senderContent = receivedPayload.senderContent, conversationId = receivedPayload.conversationId;
        console.log('[socket]: sendMessage: ' + content);
        var senderId = users[socket.id]; //Get the sender id from the users object
        console.log('[sendMessage]: senderId: ' + senderId, 'receiverId: ' + receiverId);
        //Send the message to the receiver
        for (var socketId in users) {
            if (users[socketId] === receiverId) {
                console.log('[sendMessage ok] Private message to: ' + receiverId);
                //Where we find the receiver socket id, we send the message
                socket.to(socket.id).to(socketId).emit('getMessage', {
                    senderId: senderId,
                    senderContent: senderContent,
                    content: content,
                    conversationId: conversationId
                });
                // Also emit an event to refresh conversations in case it's a new conversation
                socket.to(socketId).emit('refreshConversations');
            }
        }
        // io.emit("sendMessage", `${socket.id} said ${msg}`);
    });
    //Edit message
    socket.on('editMessage', function (receivedPayload) {
        var receiverId = receivedPayload.receiverId, messageId = receivedPayload.messageId, content = receivedPayload.content, senderContent = receivedPayload.senderContent, conversationId = receivedPayload.conversationId;
        console.log('[socket]: editMessage: ' + messageId);
        var senderId = users[socket.id]; //Get the sender id from the users object
        console.log('[editMessage]: senderId: ' + senderId, 'receiverId: ' + receiverId);
        //Send the edit message event to the receiver
        for (var socketId in users) {
            if (users[socketId] === receiverId) {
                console.log('[editMessage ok] Private message to: ' + receiverId);
                //Where we find the receiver socket id, we send the edit event
                socket.to(socket.id).to(socketId).emit('getEditMessage', {
                    messageId: messageId,
                    senderId: senderId,
                    senderContent: senderContent,
                    content: content,
                    conversationId: conversationId,
                    isEdited: true,
                    editedAt: new Date()
                });
            }
        }
    });
    //Delete message
    socket.on('deleteMessage', function (receivedPayload) {
        var receiverId = receivedPayload.receiverId, messageId = receivedPayload.messageId, conversationId = receivedPayload.conversationId;
        console.log('[socket]: deleteMessage: ' + messageId);
        var senderId = users[socket.id]; //Get the sender id from the users object
        console.log('[deleteMessage]: senderId: ' + senderId, 'receiverId: ' + receiverId);
        //Send the delete message event to the receiver
        for (var socketId in users) {
            if (users[socketId] === receiverId) {
                console.log('[deleteMessage ok] Private message to: ' + receiverId);
                //Where we find the receiver socket id, we send the delete event
                socket.to(socket.id).to(socketId).emit('getDeleteMessage', {
                    messageId: messageId,
                    senderId: senderId,
                    conversationId: conversationId,
                    isDeleted: true,
                    content: 'This message has been deleted',
                    senderContent: 'This message has been deleted'
                });
            }
        }
    });
    socket.on('disconnect', function () { return handleDisconnectEvent(socket); });
};
exports.handleSocketEvents = handleSocketEvents;
var handleDisconnectEvent = function (socket) {
    console.log("user disconnect ".concat(socket.id));
    //Remove the user from the users object
    removeUser(socket.id);
    console.log('[socket] users:', users);
};
var handleConnectEvent = function (socket, io) {
    var _a;
    //Verify and decode the JWT from the bearer header or auth object
    var tokenString = '';
    // Try to get token from Authorization header
    if (socket.handshake.headers.authorization) {
        tokenString = socket.handshake.headers.authorization.split(' ')[1] || '';
    }
    // Fallback to auth object (Socket.IO v4+)
    if (!tokenString && ((_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token)) {
        tokenString = socket.handshake.auth.token;
    }
    // Verify the token with error handling
    try {
        var token = (0, jwt_1.verifyJWT)(tokenString);
        if (token) {
            console.log("\u2705 User connected: ".concat(socket.id, " | User ID: ").concat(token.user.id));
            //   console.log("[handleConnectEvent]: ", token);
            //Store the user id and socket id in the users object
            addUser(socket.id, token.user.id);
            console.log('[socket] users:', users);
        }
        else {
            console.log('❌ [socket]: Token verification returned null');
            io.to(socket.id).emit('exception', {
                message: 'Unauthorized - Invalid token'
            });
            socket.disconnect();
        }
    }
    catch (error) {
        console.log('❌ [socket]: Token verification failed:', error instanceof Error ? error.message : 'Unknown error');
        io.to(socket.id).emit('exception', {
            message: 'Unauthorized - Token verification failed'
        });
        socket.disconnect();
    }
};
