"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const { combine, timestamp, printf } = winston_1.format;
const myFormat = printf((_a) => {
    var { level, message, timestamp } = _a, metadata = __rest(_a, ["level", "message", "timestamp"]);
    return JSON.stringify({ time: timestamp, level, message }, null, '\t');
});
exports.logger = winston_1.createLogger({
    level: 'debug',
    format: combine(timestamp(), myFormat),
    transports: [new winston_1.transports.Console({ level: 'info' })]
});
