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
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_1 = require("apollo-server");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var jwks_rsa_1 = __importDefault(require("jwks-rsa"));
var schema_1 = __importDefault(require("./schema"));
var addWorkout_1 = __importDefault(require("./validators/addWorkout"));
var addWorkout_2 = __importDefault(require("../db/write/addWorkout"));
var getWorkoutCategories_1 = __importDefault(require("../db/read/getWorkoutCategories"));
var getWorkouts_1 = __importDefault(require("../db/read/getWorkouts"));
var client = jwks_rsa_1.default({
    jwksUri: "https://" + process.env.AUTH0_DOMAIN + "/.well-known/jwks.json"
});
var getKey = function (header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
};
var options = {
    audience: process.env.AUTH0_CLIENT_ID,
    issuer: "https://" + process.env.AUTH0_DOMAIN + "/",
    algorithms: ['RS256']
};
var resolvers = {
    Query: {
        workouts: function () { return __awaiter(void 0, void 0, void 0, function () {
            var workouts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getWorkouts_1.default()];
                    case 1:
                        workouts = _a.sent();
                        return [2 /*return*/, workouts];
                }
            });
        }); },
        workoutCategories: function () { return __awaiter(void 0, void 0, void 0, function () {
            var workoutCategories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getWorkoutCategories_1.default()];
                    case 1:
                        workoutCategories = _a.sent();
                        return [2 /*return*/, workoutCategories];
                }
            });
        }); }
    },
    Mutation: {
        addWorkout: function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var validCategories, workout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, addWorkout_1.default(args, context)];
                    case 1:
                        validCategories = _a.sent();
                        return [4 /*yield*/, addWorkout_2.default(args, validCategories)];
                    case 2:
                        workout = _a.sent();
                        return [2 /*return*/, workout];
                }
            });
        }); }
    }
};
var server = new apollo_server_1.ApolloServer({
    typeDefs: schema_1.default,
    resolvers: resolvers,
    context: function (_a) {
        var req = _a.req;
        var token = req.headers.authorization;
        var noTokenErrorMessage = 'no token';
        var user = new Promise(function (resolve, reject) {
            if (!token) {
                return reject(new Error(noTokenErrorMessage));
            }
            jsonwebtoken_1.default.verify(token, getKey, options, function (err, decoded) {
                if (err) {
                    return reject(err);
                }
                resolve(decoded.email);
            });
        }).catch(function (e) {
            if (e.message === noTokenErrorMessage) {
                // Swallow error. That's ok, they will get an unauth error
            }
            else {
                throw e;
            }
        });
        return {
            user: user
        };
    },
    playground: true,
    introspection: true
});
exports.default = server;
