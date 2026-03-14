import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '@auth/interfaces/iuser';
import { Gender, IProduct, IProductsResponse } from '@products/interfaces/iproduct';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';


const BASEURL = environment.baseUrl

interface Options {
  limit?: number
  offset?: number
  gender?: string
}

const emptyProduct: IProduct = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as IUser
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
    //if(this.productCache.has(idSlug)) return of(this.productCache.get(idSlug))
    return this.http.get<IProduct>(`${ BASEURL }/products/${ idSlug }`)
      /* .pipe(
        tap( product => this.productCache.set( idSlug, product ) )
      ) */
  }

  getProductById(id: string): Observable<IProduct> {
    if( id === 'new' ) return of(emptyProduct)
    //if(this.productCache.has(id)) return of(this.productCache.get(id))
    return this.http.get<IProduct>(`${ BASEURL }/products/${ id }`)
      /* .pipe(
        tap( product => this.productCache.set( id, product ) )
      ) */
  }

  createProduct( productLike: Partial<IProduct> ): Observable<IProduct> {
    return this.http.post<IProduct>(`${ BASEURL }/products`, productLike)
      /* .pipe(
        tap( product => this.updateProductCache(product) )
      ) */
  }

  updateProduct(id: string, productLike: Partial<IProduct>): Observable<IProduct>{
    return this.http.patch<IProduct>(`${ BASEURL }/products/${ id }`, productLike )
      /* .pipe(
        tap( product => this.updateProductCache(product) )
      ) */
  }

  /* updateProductCache( product: IProduct ){
    const productId: string = product.id

    this.productCache.set( productId, product )

    this.productsCache.forEach(
      productResponse => {
        productResponse.products = productResponse.products.map(
          currentProduct => currentProduct.id === productId ? product : currentProduct
        )
      }
    )

  } */

}
