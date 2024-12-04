
import { z } from "zod";

// Define enums for UserRole and UserStatus
const UserRole = z.enum(["user", "admin", "vendor"]); // Replace with actual roles if different
const UserStatus = z.enum(["active", "blocked"]); // Replace with actual statuses if different

// Zod validation schema for the User model
const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    role: UserRole.optional(),
    status: UserStatus.optional(),
    isDelete: z.boolean().default(false).optional(),
  }),
});

export const userZodValidation = {
  updateUserZodSchema,
};
