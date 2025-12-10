import {z} from 'zod';
import { wishProductSchema } from './Products';

// Schema para un item de producto en la wishlist
export const wishlistProductItemSchema = z.object({
    product: wishProductSchema,
    _id: z.string().optional() // MongoDB agrega _id a subdocumentos
});

// Schema para la wishlist completa
export const wishlistSchema = z.object({
    _id: z.string(),
    user: z.string(),
    products: z.array(wishlistProductItemSchema),
});

// Schema para la respuesta del backend
export const wishlistResponseSchema = z.object({
    message: z.string(),
    count: z.number(),
    wishList: wishlistSchema
});

export type WishlistProductItem = z.infer<typeof wishlistProductItemSchema>;
export type Wishlist = z.infer<typeof wishlistSchema>;
export type WishlistResponse = z.infer<typeof wishlistResponseSchema>;