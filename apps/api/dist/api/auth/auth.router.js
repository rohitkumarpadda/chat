"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.authRouter = void 0;
var express_1 = require("express");
var passport_1 = __importDefault(require("passport"));
var auth_controller_1 = require("./auth.controller");
var router = (0, express_1.Router)();
exports.authRouter = router;
router.post("/login", auth_controller_1.authController.login);
router.post("/register", auth_controller_1.authController.register);
router.get("/logout", auth_controller_1.authController.logout);
router.get("/protected", passport_1["default"].authenticate("jwt", { session: false }), auth_controller_1.authController.protected);
