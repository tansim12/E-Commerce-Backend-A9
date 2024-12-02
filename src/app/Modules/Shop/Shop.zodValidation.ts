import { z } from "zod";

const createShopFollowSchema = z.object({
  body: z.object({
    shopId: z.string({ required_error: "Shop Id required" }),
    isDelete: z.boolean({ required_error: "isDelete required" }),
  }),
});

export const shopFollowSchema = {
  createShopFollowSchema,
};
