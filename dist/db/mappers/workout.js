"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map = function (_a, workoutCategories) {
    var id = _a.id, title = _a.title, required_equipment = _a.required_equipment, start_time = _a.start_time, link = _a.link, duration = _a.duration;
    return ({
        id: id,
        title: title,
        requiredEquipment: required_equipment || '',
        startTime: new Date(start_time).toISOString(),
        link: link,
        categories: workoutCategories.filter(function (workoutCategory) { return workoutCategory.workoutId === id; }),
        duration: duration
    });
};
exports.default = map;
