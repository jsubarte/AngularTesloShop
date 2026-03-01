import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IProduct, IProductsResponse } from '@products/interfaces/iproduct';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


const BASEURL = environment.baseUrl

interface Options {
  limit?: number
  offset?: number
  gender?: string
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient)

  getProducts( options: Options ): Observable<IProductsResponse> {

    const { limit = 9, offset = 0, gender = "" } = options
    return this.http.get<IProductsResponse>(`${ BASEURL }/products`,{
      params: {
        limit, offset, gender
      }
    })
      /* .pipe(
        tap( resp => console.log({resp}) )
      ) */
  }

  getProductByIdSlug( idSlug: string ): Observable<IProduct>{
    return this.http.get<IProduct>(`${ BASEURL }/products/${ idSlug }`)
  }

}
