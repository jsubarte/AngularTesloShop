import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTable } from "@products/components/product-table/product-table";
import { ProductsService } from '@products/services/products-service';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'products-admin-page',
  imports: [ProductTable, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {
  productServ = inject(ProductsService)
  //paginationServ = inject(PaginationService)

  productsPerPage = signal<number>(10)

  productResource = rxResource({
    params: () => ({
      /* page: this.paginationServ.currentPage() - 1 */
      limit: this.productsPerPage()
    }),
    stream: ( { params }) => {
      return this.productServ.getProducts({
        /* offset: params.page * 9 */
        limit: params.limit
      })
    }
  })

}
