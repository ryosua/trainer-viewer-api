"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var orm_1 = __importDefault(require("./orm"));
var graphqlServer_1 = __importDefault(require("./graphql/graphqlServer"));
graphqlServer_1.default.listen({ port: process.env.PORT || 4000 }).then(function (_a) {
    var url = _a.url;
    console.log("\uD83D\uDE80 Server ready at " + url);
    orm_1.default.authenticate()
        .then(function () {
        console.log('Connection has been established successfully.');
    })
        .catch(function (err) {
        console.error('Unable to connect to the database:', err);
    });
});
