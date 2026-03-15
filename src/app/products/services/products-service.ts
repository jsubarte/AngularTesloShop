import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '@auth/interfaces/iuser';
import { Gender, IProduct, IProductsResponse } from '@products/interfaces/iproduct';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
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

  private productsCache = new Map<string, IProductsResponse>()
  private productCache = new Map<string, IProduct>()

  getProducts( options: Options ): Observable<IProductsResponse> {

    const { limit = 9, offset = 0, gender = "" } = options

    const key = `${ limit }-${ offset }-${ gender }`
    if( this.productsCache.has(key) ){
      return of( this.productsCache.get(key)! )
    }
    return this.http.get<IProductsResponse>(`${ BASEURL }/products`,{
      params: {
        limit, offset, gender
      }
    })
    .pipe(
      tap( resp => this.productsCache.set( key, resp ) )
    )
  }

  getProductByIdSlug( idSlug: string ): Observable<IProduct>{
    if(this.productCache.has(idSlug)) return of(this.productCache.get(idSlug)!)
    return this.http.get<IProduct>(`${ BASEURL }/products/${ idSlug }`)
      .pipe(
        tap( product => this.productCache.set( idSlug, product ) )
      )
  }

  getProductById(id: string): Observable<IProduct> {
    if( id === 'new' ) return of(emptyProduct)

    if(this.productCache.has(id)) return of(this.productCache.get(id)!)

    return this.http.get<IProduct>(`${ BASEURL }/products/${ id }`)
      .pipe(
        tap( product => this.productCache.set( id, product ) )
      )
  }

  createProduct( productLike: Partial<IProduct>, imageFileList?: FileList ): Observable<IProduct> {
    const currentImages = productLike.images ?? []

    return this.uploadImages( imageFileList )
      .pipe(
        map( imageName => ({
          ...productLike,
          images: [ ...currentImages, ...imageName ]
        })),
        switchMap(
          createdProduct => this.http.post<IProduct>(`${ BASEURL }/products`, createdProduct)
        ),
        tap( product => this.updateProductCache(product) )
      )
  }

  updateProduct(id: string, productLike: Partial<IProduct>, imageFileList?: FileList): Observable<IProduct>{
    const currentImages = productLike.images ?? []
    return this.uploadImages( imageFileList )
      .pipe(
        map( imageName => ({
          ...productLike,
          images: [ ...currentImages, ...imageName ]
        })),
        switchMap(
          updatedProduct => this.http.patch<IProduct>(`${ BASEURL }/products/${ id }`, updatedProduct )
        ),
        tap( product => this.updateProductCache(product) )
      )
  }

  updateProductCache( product: IProduct ){
    const productId: string = product.id

    this.productCache.set( productId, product )

    this.productsCache.forEach(
      productResponse => {
        productResponse.products = productResponse.products.map(
          currentProduct => currentProduct.id === productId ? product : currentProduct
        )
      }
    )

  }

  uploadImages( images?: FileList ): Observable<string[]>{
    if( !images ) return of([])

    const uploadObservable = Array.from(images).map(
      imageFile => this.uploadImage(imageFile)
    )

    // forkJoin recibe un array de Observable y espera a que todos emitan exito, si uno falla lanza error
    return forkJoin(uploadObservable)

  }

  uploadImage( imageFile: File ): Observable<string>{
    const formData = new FormData()
    formData.append('file', imageFile)

    return this.http.post<{ fileName: string }>(`${ BASEURL }/files/product`, formData)
      .pipe(
        map( resp => resp.fileName )
      )
  }

}
