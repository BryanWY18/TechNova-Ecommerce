import z from 'zod';
import { Category } from './Category';

export type Product = {
  _id:string;
  name: string;
  description: string;
  price: number;
  offer: number;
  stock: number;
  imagesUrl: string[];
  category: Category;
};

export type ProductResponse = {
  products: Product[];
  pagination: {
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    totalPages: number; 
    totalResults: number;
  };
};

export const productSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  offer: z.number().min(0),
  stock: z.number().int().nonnegative(),
  imagesUrl: z.array(z.string()),
});

export const cartProductSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    imageUrl: z.string().optional(),
    stock: z.number(),
    category: z.string(),
});

export const wishProductSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    imageUrl: z.string().optional(),
    stock: z.number(),
    category: z.string(),
});

export const productArraySchema = z.array(productSchema);