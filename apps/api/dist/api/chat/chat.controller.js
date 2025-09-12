"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.chatController = void 0;
var models_1 = require("~/api/chat/models");
var user_model_1 = __importDefault(require("../user/user.model"));
var key_model_1 = require("../key/key.model");
var controller = {
    //Create a new conversation between two users
    createConversation: function (req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, receiverId, receiverPublicKey, receiver, currentUser, isBlockedByReceiver, hasBlockedReceiver, receiverKey, existingConversation, conversation, e_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 6, , 7]);
                        _c = req.body, receiverId = _c.receiverId, receiverPublicKey = _c.receiverPublicKey;
                        if (!receiverId) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Receiver id is required"
                                })];
                        }
                        if (!receiverPublicKey) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Receiver's public key is required to start a conversation"
                                })];
                        }
                        if (receiverId === req.user._id) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "You cannot send a message to yourself"
                                })];
                        }
                        return [4 /*yield*/, user_model_1["default"].findById(receiverId)];
                    case 1:
                        receiver = _d.sent();
                        if (!receiver) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Receiver id is not valid"
                                })];
                        }
                        return [4 /*yield*/, user_model_1["default"].findById(req.user._id)];
                    case 2:
                        currentUser = _d.sent();
                        isBlockedByReceiver = (_a = receiver.blockedUsers) === null || _a === void 0 ? void 0 : _a.includes(req.user._id);
                        hasBlockedReceiver = (_b = currentUser === null || currentUser === void 0 ? void 0 : currentUser.blockedUsers) === null || _b === void 0 ? void 0 : _b.includes(receiverId);
                        if (isBlockedByReceiver || hasBlockedReceiver) {
                            return [2 /*return*/, res.status(403).json({
                                    message: "Unable to start conversation. User may be blocked."
                                })];
                        }
                        return [4 /*yield*/, key_model_1.KeyModel.findOne({ userId: receiverId })];
                    case 3:
                        receiverKey = _d.sent();
                        if (!receiverKey) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Receiver has not set up encryption keys"
                                })];
                        }
                        if (receiverKey.publicKey.trim() !== receiverPublicKey.trim()) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Invalid public key provided for the receiver"
                                })];
                        }
                        return [4 /*yield*/, models_1.ConversationModel.findOne({
                                participants: {
                                    $all: [req.user._id, receiverId]
                                }
                            })];
                    case 4:
                        existingConversation = _d.sent();
                        if (existingConversation) {
                            return [2 /*return*/, res.status(200).json(existingConversation)];
                        }
                        return [4 /*yield*/, models_1.ConversationModel.create({
                                participants: [req.user._id, receiverId]
                            })];
                    case 5:
                        conversation = _d.sent();
                        res.status(201).json(conversation);
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _d.sent();
                        console.log(e_1);
                        res.status(500).json({
                            message: "Something went wrong"
                        });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    getConversationList: function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var conversations, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, models_1.ConversationModel.find({
                                participants: {
                                    $in: [req.user._id]
                                }
                            }).populate({
                                path: "participants",
                                select: {
                                    name: 1,
                                    username: 1,
                                    email: 1
                                }
                            })];
                    case 1:
                        conversations = _a.sent();
                        res.status(200).json(conversations);
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        console.log(e_2);
                        res.status(500).json({
                            message: "Something went wrong"
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    //Get a conversation by id
    getMessages: function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var conversationId, messages, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        conversationId = req.params.conversationId;
                        return [4 /*yield*/, models_1.MessageModel.find({
                                conversationId: conversationId
                            })];
                    case 1:
                        messages = _a.sent();
                        res.status(200).json(messages);
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        console.log(e_3);
                        res.status(500).json({
                            message: "Something went wrong"
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    //Send a message to a conversation
    sendMessage: function (req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var conversationId, _c, content, senderContent, conversation, participants, otherParticipant, currentUser, isBlockedByOther, hasBlockedOther, newMessage, e_4;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, , 6]);
                        conversationId = req.params.conversationId;
                        _c = req.body, content = _c.content, senderContent = _c.senderContent;
                        if (!content || !senderContent) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Sender and receiver content is required"
                                })];
                        }
                        return [4 /*yield*/, models_1.ConversationModel.findById(conversationId).populate('participants')];
                    case 1:
                        conversation = _d.sent();
                        if (!conversation) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Conversation not found"
                                })];
                        }
                        participants = conversation.participants;
                        otherParticipant = participants.find(function (p) { return p._id.toString() !== req.user._id.toString(); });
                        if (!otherParticipant) return [3 /*break*/, 3];
                        return [4 /*yield*/, user_model_1["default"].findById(req.user._id)];
                    case 2:
                        currentUser = _d.sent();
                        isBlockedByOther = (_a = otherParticipant.blockedUsers) === null || _a === void 0 ? void 0 : _a.includes(req.user._id);
                        hasBlockedOther = (_b = currentUser === null || currentUser === void 0 ? void 0 : currentUser.blockedUsers) === null || _b === void 0 ? void 0 : _b.includes(otherParticipant._id);
                        if (isBlockedByOther || hasBlockedOther) {
                            return [2 /*return*/, res.status(403).json({
                                    message: "Unable to send message. User may be blocked."
                                })];
                        }
                        _d.label = 3;
                    case 3: return [4 /*yield*/, models_1.MessageModel.create({
                            conversationId: conversationId,
                            senderId: req.user._id,
                            content: content,
                            senderContent: senderContent
                        })];
                    case 4:
                        newMessage = _d.sent();
                        res.status(201).json(newMessage);
                        return [3 /*break*/, 6];
                    case 5:
                        e_4 = _d.sent();
                        console.log(e_4);
                        res.status(500).json({
                            message: "Something went wrong"
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    //Edit a message
    editMessage: function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var messageId, _a, content, senderContent, updatedMessage, e_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        messageId = req.params.messageId;
                        _a = req.body, content = _a.content, senderContent = _a.senderContent;
                        if (!content || !senderContent) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Content and sender content are required"
                                })];
                        }
                        return [4 /*yield*/, models_1.MessageModel.findByIdAndUpdate(messageId, {
                                content: content,
                                senderContent: senderContent,
                                isEdited: true,
                                editedAt: new Date()
                            }, { "new": true })];
                    case 1:
                        updatedMessage = _b.sent();
                        res.status(200).json(updatedMessage);
                        return [3 /*break*/, 3];
                    case 2:
                        e_5 = _b.sent();
                        console.log(e_5);
                        res.status(500).json({
                            message: "Something went wrong"
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    //Delete a message
    deleteMessage: function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var messageId, deletedMessage, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        messageId = req.params.messageId;
                        return [4 /*yield*/, models_1.MessageModel.findByIdAndUpdate(messageId, {
                                isDeleted: true,
                                content: "This message has been deleted",
                                senderContent: "This message has been deleted"
                            }, { "new": true })];
                    case 1:
                        deletedMessage = _a.sent();
                        res.status(200).json(deletedMessage);
                        return [3 /*break*/, 3];
                    case 2:
                        e_6 = _a.sent();
                        console.log(e_6);
                        res.status(500).json({
                            message: "Something went wrong"
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
exports.chatController = controller;
