import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core'
import { RouterLink } from "@angular/router";
import { IProduct } from '@products/interfaces/iproduct';
import { ProductImagePipe } from '@products/pipes/productimage-pipe';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<IProduct>()
  imageUrl = computed(() => { return `http://localhost:3000/api/files/product/${ this.product().images[0] }` })
}
