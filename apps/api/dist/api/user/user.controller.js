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
exports.userController = void 0;
var user_model_1 = __importDefault(require("./user.model"));
exports.userController = {
    //Used to get the current user information
    getUserInfo: function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                try {
                    user = req.user;
                    if (user) {
                        res.json({
                            username: user.username,
                            name: user.name
                        });
                    }
                    else {
                        throw new Error("User not found");
                    }
                }
                catch (e) {
                    console.log(e);
                    res.status(500).json({
                        message: "Something went wrong"
                    });
                }
                return [2 /*return*/];
            });
        });
    },
    //Could search by username or email
    searchUsers: function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var query, projection, searchResult, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = req.query.q;
                        projection = { username: 1, name: 1 };
                        if (!query || query.toString().trim().length === 0) {
                            // Return empty array when no search query is provided for privacy
                            return [2 /*return*/, res.json([])];
                        }
                        // Require minimum 2 characters for search to prevent broad searches
                        if (query.toString().trim().length < 2) {
                            return [2 /*return*/, res.json([])];
                        }
                        return [4 /*yield*/, user_model_1["default"].find({
                                _id: { $ne: req.user._id },
                                username: query.toString().trim() // Exact match, case-sensitive
                            }, projection).limit(5)];
                    case 1:
                        searchResult = _a.sent();
                        return [2 /*return*/, res.json(searchResult)];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        res.status(500).json({
                            message: "Something went wrong"
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    //Block a user
    blockUser: function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userId, userToBlock, currentUser, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        userId = req.body.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "User ID is required"
                                })];
                        }
                        if (userId === req.user._id.toString()) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "You cannot block yourself"
                                })];
                        }
                        return [4 /*yield*/, user_model_1["default"].findById(userId)];
                    case 1:
                        userToBlock = _b.sent();
                        if (!userToBlock) {
                            return [2 /*return*/, res.status(404).json({
                                    message: "User not found"
                                })];
                        }
                        return [4 /*yield*/, user_model_1["default"].findById(req.user._id)];
                    case 2:
                        currentUser = _b.sent();
                        if ((_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.blockedUsers) === null || _a === void 0 ? void 0 : _a.includes(userId)) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "User is already blocked"
                                })];
                        }
                        //Add user to blocked list
                        return [4 /*yield*/, user_model_1["default"].findByIdAndUpdate(req.user._id, {
                                $addToSet: { blockedUsers: userId }
                            })];
                    case 3:
                        //Add user to blocked list
                        _b.sent();
                        res.status(200).json({
                            message: "User blocked successfully"
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _b.sent();
                        console.log(e_2);
                        res.status(500).json({
                            message: "Something went wrong"
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    //Unblock a user
    unblockUser: function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.body.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "User ID is required"
                                })];
                        }
                        //Remove user from blocked list
                        return [4 /*yield*/, user_model_1["default"].findByIdAndUpdate(req.user._id, {
                                $pull: { blockedUsers: userId }
                            })];
                    case 1:
                        //Remove user from blocked list
                        _a.sent();
                        res.status(200).json({
                            message: "User unblocked successfully"
                        });
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
    //Get blocked users list
    getBlockedUsers: function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, user_model_1["default"].findById(req.user._id)
                                .populate("blockedUsers", "username name email")
                                .select("blockedUsers")];
                    case 1:
                        user = _a.sent();
                        res.status(200).json((user === null || user === void 0 ? void 0 : user.blockedUsers) || []);
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        console.log(e_4);
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
