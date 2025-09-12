"use strict";
exports.__esModule = true;
exports.MessageModel = void 0;
var mongoose_1 = require("mongoose");
var MessageSchema = new mongoose_1.Schema({
    //Encrypt using the receiver's public key
    content: {
        type: String,
        required: true
    },
    //Encrypt using the sender's private key as the sender need to be able to decrypt the message
    senderContent: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    isDeleted: {
        type: Boolean,
        "default": false
    },
    isEdited: {
        type: Boolean,
        "default": false
    },
    editedAt: {
        type: Date
    }
}, { timestamps: true });
exports.MessageModel = mongoose_1.models.Message || (0, mongoose_1.model)("Message", MessageSchema);
