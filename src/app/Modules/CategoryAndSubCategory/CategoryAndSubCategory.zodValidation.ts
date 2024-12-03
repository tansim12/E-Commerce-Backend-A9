import { z } from "zod";

const createCategorySchema = z.object({
  body: z.object({
    categoryName: z.string({ required_error: "Category name string required" }),
    isDelete: z
      .boolean({ required_error: "isDelete boolean required" })
      .optional(),
  }),
});

export const categoryAndSubCategorySchema = {
  createCategorySchema,
};
