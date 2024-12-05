import { z } from "zod";

const createProductValidationSchema = z.object({
  body: z.object({
    productName: z.string().min(1, "Product name is required"),
    quantity: z.number().int().min(0).default(1).optional(),
    isAvailable: z.boolean().default(true).optional(),
    totalBuy: z.number().int().min(0).default(0).optional(),
    price: z.number().int().positive("Price must be a positive integer"),
    discount: z.number().int().min(0).nullable().optional(),
    promo: z.string().nullable().optional(),
    isActivePromo: z.boolean().default(false).optional(),
    isFlashSaleOffer: z.boolean().default(false).optional(),
    flashSaleDiscount: z.number().int().min(0).default(0).nullable().optional(),
    flashSaleStartDate: z.date().nullable().optional(),
    flashSaleEndDate: z.date().nullable().optional(),
    description: z.string().min(1, "Description is required"),
    totalSubmitRating: z.number().int().min(0).default(0).optional(),
    averageRating: z.number().int().min(0).default(0).optional(),
    images: z
      .array(z.string().url(), {
        required_error: "At least one image is required",
      })
      .nonempty(),
    categoryId: z.string(),
    subCategoryId: z.string().nullable().optional(),
    isDelete: z.boolean().default(false).optional(),
  }),
});

export const productSchema = {
  createProductValidationSchema,
};
