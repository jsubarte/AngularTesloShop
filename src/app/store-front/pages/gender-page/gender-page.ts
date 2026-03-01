import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products-service';
import { map } from 'rxjs';
import { ProductCard } from "@products/components/product-card/product-card";

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  route = inject(ActivatedRoute)

  gender = toSignal(
    this.route.params.pipe(
      map( ({ gender }) => gender )
    )
  )

  productsService = inject(ProductsService)

  productResource = rxResource({
    params: () => ({ gender: this.gender() }),
    stream: ( { params }) => {
      return this.productsService.getProducts({
        gender: params.gender
      })
    }
  })

}
