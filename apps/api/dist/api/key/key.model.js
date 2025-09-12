"use strict";
exports.__esModule = true;
exports.KeyModel = void 0;
var mongoose_1 = require("mongoose");
var KeySchema = new mongoose_1.Schema({
    // privateKey: {
    //   type: String,
    // },
    publicKey: {
        type: String,
        required: true
    },
    //Each user csn have only one key pair
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    }
}, { timestamps: true });
exports.KeyModel = mongoose_1.models.Key || (0, mongoose_1.model)("Key", KeySchema);
