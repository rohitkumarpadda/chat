"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var password_1 = require("~/utils/password");
var UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    blockedUsers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        },
    ]
}, { timestamps: true });
UserSchema.pre("save", function (next) {
    var _this = this;
    //If the password is not modified, we don't need to hash it again as it will waste computation power
    if (!this.isModified("password"))
        return next();
    (0, password_1.hashPassword)(this.password).then(function (passwordHash) {
        _this.password = passwordHash;
        next();
    });
});
var UserModel = mongoose_1.models.User || (0, mongoose_1.model)("User", UserSchema);
exports["default"] = UserModel;
