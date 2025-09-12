"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.keyRouter = void 0;
var express_1 = require("express");
var passport_1 = __importDefault(require("passport"));
var key_controller_1 = require("./key.controller");
var router = (0, express_1.Router)();
exports.keyRouter = router;
router.use(passport_1["default"].authenticate("jwt", { session: false }));
router.get("/public-key/:userId", key_controller_1.keyController.getPublicKey);
router.post("/public-key", key_controller_1.keyController.postPublicKey);
