"use strict";
exports.__esModule = true;
exports.ConversationModel = void 0;
var lodash_1 = require("lodash");
var mongoose_1 = require("mongoose");
var ConversationSchema = new mongoose_1.Schema({
    participants: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
        ],
        required: true,
        validate: function (v) { return (0, lodash_1.isArray)(v) && v.length > 1; }
    }
}, { timestamps: true });
exports.ConversationModel = mongoose_1.models.Conversation ||
    (0, mongoose_1.model)("Conversation", ConversationSchema);
