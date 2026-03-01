import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';


const BASEURL = environment.baseUrl

@Pipe({
  name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
  transform( value: string | string[] ): any {
    if( typeof value === 'string' ) return `${ BASEURL }/files/product/${ value }`

    const image = value[0]

    if( !image ) return './assets/images/no-image.jpg'

    return `${ BASEURL }/files/product/${ image }`
  }
}
