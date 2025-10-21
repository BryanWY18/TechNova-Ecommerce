import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/types/Products';
import { ProductsService } from '../../core/services/products/products.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit{
  product: Product | null = null;

  constructor(private productService: ProductsService, private route: ActivatedRoute, private cartService: CartService){}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next:(params)=>{
        console.log(params)
        const id = params.get('id');
        if (!id) {
          return
        }
        this.productService.getProductByID(id).subscribe({
          next:(product)=>{
            this.product = product;
            console.log(product.imagesUrl)
          },
          error: (error)=>{
            this.product = null;
          }
        });
      }
    })
    // this.productService.getProductByID();
  }
    loading:boolean = false;
  
  
    addToCart(){
      if(!this.product || !this.product._id){
        return
      }
      this.loading = true
      console.log(this.loading);
      this.cartService.addToCart(this.product._id).subscribe({
        next:()=> this.loading = false,
        error:()=> this.loading = false,
      });
    }


}
