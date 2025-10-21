import { Component, OnInit } from '@angular/core';
import { CarouselComponent } from "../../components/carousel/carousel.component";
import { map, Observable } from 'rxjs';
import { ProductsService, filters } from '../../core/services/products/products.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  indicators:boolean = false;
  autoPlay: boolean = true;

  title: string ='';

  imagesForCarousel: { src: string; loaded: boolean; loading: boolean; alt: string; }[] = [];

  constructor(private productService:ProductsService){
    this.title$.pipe(
      map(data=>{
        return data.toDateString()
      }
      )
    ).subscribe(this.setTitle)
  }

  private setTitle= ()=>{
    const date = new Date();
    this.title = `(${date})`
  }

  title$ = new Observable<Date>((observer)=>{
    setInterval(()=>{
      observer.next(new Date())
    }, 2000)
  })

  ngOnInit(): void {
  // Define la configuración de búsqueda para los productos del carrusel
  const carrouselConfig: filters = {
    sort: 'price',
    order: 'asc',
    limit: 5 // Asumiendo que tu backend también puede manejar el límite
  };

  // Llama a la función searchProducts con la configuración
  this.productService.searchProducts(carrouselConfig).subscribe(products => {
    // products ya es un array de productos ordenados y limitados
    const topFiveProducts = products;

    // Mapea los productos a la estructura de 'imagesForCarousel'
    this.imagesForCarousel = topFiveProducts.map((product) => ({
      src: product.imagesUrl[0],
      loaded: false,
      loading: false,
      alt: product.name
    }));
  });
  }

}
