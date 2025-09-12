"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.chatRouter = void 0;
var express_1 = require("express");
var passport_1 = __importDefault(require("passport"));
var chat_controller_1 = require("./chat.controller");
var middleware_1 = require("./middleware");
var router = (0, express_1.Router)();
exports.chatRouter = router;
router.use(passport_1["default"].authenticate("jwt", { session: false }));
router.post("/conversations", chat_controller_1.chatController.createConversation);
router.get("/conversations", chat_controller_1.chatController.getConversationList);
router.get("/messages/:conversationId", middleware_1.conversationGuard, chat_controller_1.chatController.getMessages);
router.post("/messages/:conversationId", middleware_1.conversationGuard, chat_controller_1.chatController.sendMessage);
//Edit a message
router.put("/messages/:messageId", middleware_1.messageGuard, chat_controller_1.chatController.editMessage);
//Delete a message
router["delete"]("/messages/:messageId", middleware_1.messageGuard, chat_controller_1.chatController.deleteMessage);
