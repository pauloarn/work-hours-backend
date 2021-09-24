"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const convertHoursToMinutes_1 = __importDefault(require("./convertHoursToMinutes"));
function sumWorkedHours(firstTime, secondTime, thirdTime, fourthTime) {
    const fHour = convertHoursToMinutes_1.default(firstTime);
    const sHour = convertHoursToMinutes_1.default(secondTime);
    const tHour = convertHoursToMinutes_1.default(thirdTime);
    const fouHour = convertHoursToMinutes_1.default(fourthTime);
    const firstHalf = sHour - fHour;
    const secondHalf = fouHour - tHour;
    const final = firstHalf + secondHalf;
    return final;
}
exports.default = sumWorkedHours;
