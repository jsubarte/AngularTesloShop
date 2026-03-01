import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products-service';
import { ProductCarrousel } from "@products/components/product-carrousel/product-carrousel";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarrousel],
  templateUrl: './product-page.html',
})
export class ProductPage {

  activatedRoute = inject(ActivatedRoute)
  productService = inject(ProductsService)

  //snapshot para tomar algo de la url actual
  producIdSlug = this.activatedRoute.snapshot.params['idSlug']

  productResource = rxResource({
    params: () => ({ idSlug: this.producIdSlug }),
    stream: ( { params } ) => this.productService.getProductByIdSlug(params.idSlug)
  })
}
