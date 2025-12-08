import { z } from 'zod';
import { userSchema } from './User';
import { productSchema } from './Products';
import { ShippingAddressSchema } from './ShippingAddress';
import { PaymentMethodSchema } from './PaymentMethod';

export const CreateOrderSchema = z.object({
  user: z.string(),
  products: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })),
  shippingAddress: z.string(),
  paymentMethod: z.string(),
  shippingCost: z.number().min(0).default(0),
  totalPrice: z.number().min(0)
});

export const OrderSchema = z.object({
  _id: z.string(),
  user: userSchema,
  products: z.array(z.object({
    productId: productSchema,
    quantity: z.number().min(1),
    price: z.number().min(0),
    _id: z.string().optional()
  })),
  shippingAddress: ShippingAddressSchema,
  paymentMethod: PaymentMethodSchema,
  shippingCost: z.number().min(0),
  totalPrice: z.number().min(0),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional()
});

export const OrderArraySchema = z.array(OrderSchema);

export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type Order = z.infer<typeof OrderSchema>;