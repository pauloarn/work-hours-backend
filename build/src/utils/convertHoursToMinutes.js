"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertHoursToMinutes(time) {
    const [hour, minutes] = time.split(':').map(Number);
    const timeInMinutes = (hour * 60) + minutes;
    return timeInMinutes;
}
exports.default = convertHoursToMinutes;
