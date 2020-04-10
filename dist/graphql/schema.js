"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_1 = require("apollo-server");
var typeDefs = apollo_server_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    type Workout {\n        id: Int!\n        title: String!\n        startTime: String!\n        link: String!\n        requiredEquipment: String\n        categories: [WorkoutCategory]!\n        duration: Int!\n    }\n\n    type WorkoutCategory {\n        id: Int!\n        title: String!\n    }\n\n    type Query {\n        workouts: [Workout]\n        workoutCategories: [WorkoutCategory]\n    }\n\n    type Mutation {\n        addWorkout(\n            title: String!\n            requiredEquipment: String\n            startTime: String!\n            link: String!\n            categories: [Int]!\n            duration: Int!\n        ): Workout\n    }\n"], ["\n    type Workout {\n        id: Int!\n        title: String!\n        startTime: String!\n        link: String!\n        requiredEquipment: String\n        categories: [WorkoutCategory]!\n        duration: Int!\n    }\n\n    type WorkoutCategory {\n        id: Int!\n        title: String!\n    }\n\n    type Query {\n        workouts: [Workout]\n        workoutCategories: [WorkoutCategory]\n    }\n\n    type Mutation {\n        addWorkout(\n            title: String!\n            requiredEquipment: String\n            startTime: String!\n            link: String!\n            categories: [Int]!\n            duration: Int!\n        ): Workout\n    }\n"])));
exports.default = typeDefs;
var templateObject_1;
