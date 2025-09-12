"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.configurePassport = void 0;
var passport_1 = __importDefault(require("passport"));
var jwtStrategy_1 = require("./jwtStrategy");
//passport.use("local", localStrategy);
passport_1["default"].use("jwt", jwtStrategy_1.jwtStrategy);
var configurePassport = function (app) {
    // Passport middleware
    app.use(passport_1["default"].initialize());
};
exports.configurePassport = configurePassport;
