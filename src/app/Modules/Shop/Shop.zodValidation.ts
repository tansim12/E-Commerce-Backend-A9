import { z } from "zod";

const createShopFollowSchema = z.object({
  body: z.object({
    shopId: z.string({ required_error: "Shop Id required" }),
    isDelete: z.boolean({ required_error: "isDelete required" }),
  }),
});
const createShopReviewSchema = z.object({
  body: z.object({
    shopId: z.string({ required_error: "Shop Id required" }),
    isDelete: z.boolean({ required_error: "isDelete required" }),
    details: z.string({ required_error: "Details required" }),
    rating: z
      .number({ required_error: "Number required" })
      .min(0)
      .max(5)
      .optional(),
  }),
});

export const shopFollowSchema = {
  createShopFollowSchema,
  createShopReviewSchema,
};
