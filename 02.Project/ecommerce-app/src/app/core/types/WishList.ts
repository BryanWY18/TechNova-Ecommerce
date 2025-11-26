import {z} from 'zod';
import { cartProductSchema } from './Products';
import { userSchema } from './User';

export const wishlistSchema = z.object({
    _id: z.string(),
    user: userSchema,
    products: z.array(z.object({
        product: cartProductSchema , 
        quantity: z.number().min(1)
    })),
    
});
export const wishArraySchema = z.array(wishlistSchema);

export type Wishlist = z.infer<typeof wishlistSchema>;