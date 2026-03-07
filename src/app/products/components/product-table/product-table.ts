import { Component, input } from '@angular/core';
import { IProduct } from '@products/interfaces/iproduct';
import { ProductImagePipe } from "../../pipes/productimage-pipe";
import { RouterLink } from "@angular/router";
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'product-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './product-table.html',
})
export class ProductTable {

  products = input.required<IProduct[]>()
}
