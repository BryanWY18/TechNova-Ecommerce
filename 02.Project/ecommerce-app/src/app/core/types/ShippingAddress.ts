import { z } from 'zod';

export const ShippingAddressSchema = z.object({
  _id: z.string(),
  userName: z.string().optional(),
  address: z.string().optional(),
  city:z.string().optional(),
  state: z.string().optional(),
  postalCode:z.string().optional(),
  country:z.string().optional(),
  phone:z.string().min(10).optional(),
  isDefault: z.boolean(),
});

export const ShippingAddressArraySchema = z.array(ShippingAddressSchema);
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>

export const CreateShippingAddressSchema = ShippingAddressSchema.omit({_id: true})
export type CreateShippingAddress = z.infer<typeof CreateShippingAddressSchema>;

export const UpdateShippingAddressSchema = ShippingAddressSchema.partial().required({_id: true});
export type UpdateShippingAddressMethod = z.infer<typeof UpdateShippingAddressSchema>;