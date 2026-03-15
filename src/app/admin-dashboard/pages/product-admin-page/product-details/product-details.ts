import { Component, inject, input, OnInit, signal } from '@angular/core';
import { IProduct } from '@products/interfaces/iproduct';
import { ProductCarrousel } from "@products/components/product-carrousel/product-carrousel";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from "@shared/components/form-error-label/form-error-label";
import { ProductsService } from '@products/services/products-service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'product-details',
  imports: [ProductCarrousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  product = input.required<IProduct>()

  productService = inject(ProductsService)

  router = inject(Router)

  fb = inject(FormBuilder)

  wasSave = signal<boolean>(false)

  imageList: FileList | undefined = undefined

  tempImages = signal<string[]>([])

  productForm = this.fb.group({
    title: [ '', Validators.required ],
    description: [ '', Validators.required ],
    slug: [ '',
      [ Validators.required, Validators.pattern(FormUtils.slugPattern )]
    ],
    price: [ 0, [ Validators.required, Validators.min(0) ] ],
    stock: [ 0, [ Validators.required, Validators.min(0) ] ],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [ 'men', [ Validators.required, Validators.pattern(/men|women|kid|unisex/) ] ]
  })

  sizes = [ 'XS', 'S', 'M', 'L', 'XL', 'XXL' ]

  ngOnInit(): void {
    this.setFormValue(this.product())
  }

  setFormValue( formLike: Partial<IProduct> ) {
    this.productForm.reset(this.product() as any)
    this.productForm.patchValue({ tags: formLike.tags?.join(',') })
  }

  onSizeClicked( size: string ){
    const currentSize = this.productForm.value.sizes ?? []

    if( currentSize.includes(size) ){
      currentSize.splice(currentSize.indexOf(size), 1)
    }
    else {
      currentSize.push(size)
    }

    this.productForm.patchValue( { sizes: currentSize } )

  }

  async onSubmit() {
    const isValid = this.productForm.valid
    this.productForm.markAllAsTouched() // muestra todos los errores del formulario si los hay

    if( !isValid ) return

    const formValue = this.productForm.value

    const productLike: Partial<IProduct> = {
      ...( formValue as any ),
      tags: formValue.tags?.toLowerCase().split(',').map( tag => tag.trim() ) ?? []
    }

    if( this.product().id === 'new' ){
      // Creamos producto
      const product = await firstValueFrom(
        this.productService.createProduct(productLike)
      )
      this.router.navigate( [ '/admin/products', product.id ] )
    }
    else{
      // Actualizamos producto
      await firstValueFrom(
        this.productService.updateProduct( this.product().id, productLike )
      )
    }

    this.wasSave.set(true)
    setTimeout(
      () => {
        this.wasSave.set(false)
      }, 3000
    )

  }

  onFilesChanged( event: Event ){
    const fileList = ( event.target as HTMLInputElement ).files

    this.imageList = fileList ?? undefined

    const imageTempUrls = Array.from( fileList ?? [] ).map(
      file => URL.createObjectURL(file)
    )

    this.tempImages.set(imageTempUrls)
  }
}
