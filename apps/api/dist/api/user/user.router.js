"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.userRouter = void 0;
var express_1 = require("express");
var passport_1 = __importDefault(require("passport"));
var user_controller_1 = require("./user.controller");
var router = (0, express_1.Router)();
exports.userRouter = router;
router.use(passport_1["default"].authenticate("jwt", { session: false }));
//routes that get user info
router.get("/me", user_controller_1.userController.getUserInfo);
//route that fuzzy search by username or email
router.get("/search", user_controller_1.userController.searchUsers);
//Block a user
router.post("/block", user_controller_1.userController.blockUser);
//Unblock a user
router.post("/unblock", user_controller_1.userController.unblockUser);
//Get blocked users
router.get("/blocked", user_controller_1.userController.getBlockedUsers);
