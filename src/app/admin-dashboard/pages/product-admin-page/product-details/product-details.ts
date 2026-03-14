import { Component, inject, input, OnInit } from '@angular/core';
import { IProduct } from '@products/interfaces/iproduct';
import { ProductCarrousel } from "@products/components/product-carrousel/product-carrousel";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'product-details',
  imports: [ProductCarrousel, ReactiveFormsModule],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  product = input.required<IProduct>()

  fb = inject(FormBuilder)

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

  onSubmit() {
    console.log(this.productForm.value)
  }
}
