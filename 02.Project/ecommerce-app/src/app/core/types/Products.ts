import { Category } from './Category';

export type Product = {
  _id:string;
  name: string;
  description: string;
  price: number;
  offer: number;
  stock: number;
  imageUrl: string;
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
