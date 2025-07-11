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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var User_1 = require("../models/User");
var CreditCard_1 = require("../models/CreditCard");
var FrequentFlyerProgram_1 = require("../models/FrequentFlyerProgram");
// Cleanup function
// MongoDB connection
var MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI is not defined in .env');
    process.exit(1);
}
var clearDatabase = function () { return __awaiter(void 0, void 0, void 0, function () {
    var userResult, ccResult, ffpResult, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, mongoose_1.default.connect(MONGODB_URI, {
                        dbName: 'pneuma-frequent-flyer-program',
                    })];
            case 1:
                _a.sent();
                console.log('🔗 Connected to MongoDB');
                return [4 /*yield*/, User_1.default.deleteOne({ username: 'admin@gmail.com' })];
            case 2:
                userResult = _a.sent();
                if (userResult.deletedCount) {
                    console.log('🗑️ Admin user deleted');
                }
                else {
                    console.log('ℹ️ Admin user not found');
                }
                return [4 /*yield*/, CreditCard_1.default.deleteMany({})];
            case 3:
                ccResult = _a.sent();
                console.log("\uD83E\uDDFE Credit cards deleted: ".concat(ccResult.deletedCount));
                return [4 /*yield*/, FrequentFlyerProgram_1.default.deleteMany({})];
            case 4:
                ffpResult = _a.sent();
                console.log("\u2708\uFE0F Frequent flyer programs deleted: ".concat(ffpResult.deletedCount));
                return [4 /*yield*/, mongoose_1.default.disconnect()];
            case 5:
                _a.sent();
                console.log('🔌 Disconnected from MongoDB');
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error('❌ Error while clearing the database:', error_1);
                process.exit(1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// Execute the cleanup
clearDatabase();
