"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var FrequentFlyerProgramSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    assetName: {
        type: String,
        default: '',
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    archived: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
        default: Date.now,
    },
});
FrequentFlyerProgramSchema.pre('save', function (next) {
    this.modifiedAt = new Date();
    next();
});
exports.default = mongoose_1.default.model('FrequentFlyerProgram', FrequentFlyerProgramSchema);
