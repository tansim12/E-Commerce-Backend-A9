import { UserGender } from "@prisma/client";
import { z } from "zod";

const createAdminZodSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: "Password is required",
    }),
    admin: z.object({
      name: z.string({
        required_error: "Name is required!",
      }),
      email: z.string({
        required_error: "Email is required!",
      }),
      contactNumber: z.string({
        required_error: "Contact Number is required!",
      }),
    }),
  }),
});

const createDoctorZodSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: "Password is required",
    }),
    doctor: z.object({
      name: z.string({
        required_error: "Name is required!",
      }),
      email: z.string({
        required_error: "Email is required!",
      }),
      contactNumber: z.string({
        required_error: "Contact Number is required!",
      }),
      address: z.string().optional(),
      registrationNumber: z.string({
        required_error: "Reg number is required",
      }),
      experience: z.number().optional(),
      gender: z.enum([UserGender.MALE, UserGender.FEMALE]),
      appointmentFee: z.number({
        required_error: "appointment fee is required",
      }),
      qualification: z.string({
        required_error: "quilification is required",
      }),
      currentWorkingPlace: z.string({
        required_error: "Current working place is required!",
      }),
      designation: z.string({
        required_error: "Designation is required!",
      }),
    }),
  }),
});

const createPatientZodSchema = z.object({
  body: z.object({
    password: z.string(),
    patient: z.object({
      email: z
        .string({
          required_error: "Email is required!",
        })
        .email(),
      name: z.string({
        required_error: "Name is required!",
      }),
      contactNumber: z.string({
        required_error: "Contact number is required!",
      }),
      address: z.string({
        required_error: "Address is required",
      }),
    }),
  }),
});

// Define enums for UserRole and UserStatus
const UserRole = z.enum(["PATIENT", "ADMIN", "DOCTOR"]); // Replace with actual roles if different
const UserStatus = z.enum(["ACTIVE", "BLOCKED", "DELETED"]); // Replace with actual statuses if different

// Zod validation schema for the User model
const updateUserZodSchema = z.object({
  body: z.object({
    role: UserRole.default("PATIENT").optional(),
    status: UserStatus.default("ACTIVE").optional(),
    isDelete: z.boolean().default(false).optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .optional(), // Adjust validation as needed
    needPasswordChange: z.boolean().default(true).optional(),
  }),
});

export const userZodValidation = {
  createDoctorZodSchema,
  createPatientZodSchema,
  createAdminZodSchema,
  updateUserZodSchema,
};
