"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userZodValidation = void 0;
const zod_1 = require("zod");
// Define enums for UserRole and UserStatus
const UserRole = zod_1.z.enum(["user", "admin", "vendor"]); // Replace with actual roles if different
const UserStatus = zod_1.z.enum(["active", "blocked"]); // Replace with actual statuses if different
// Zod validation schema for the User model
const updateUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        role: UserRole.optional(),
        status: UserStatus.optional(),
        isDelete: zod_1.z.boolean().default(false).optional(),
    }),
});
exports.userZodValidation = {
    updateUserZodSchema,
};
