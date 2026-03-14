import { IUser } from "@auth/interfaces/iuser"

interface IProductsResponse {
  count:    number;
  pages:    number;
  products: IProduct[];
}

interface IProduct {
  id:          string;
  title:       string;
  price:       number;
  description: string;
  slug:        string;
  stock:       number;
  sizes:       Size[];
  gender:      Gender;
  tags:        string[];
  images:      string[];
  user:        IUser;
}

export enum Gender {
  Kid = "kid",
  Men = "men",
  Unisex = "unisex",
  Women = "women",
}

enum Size {
  L = "L",
  M = "M",
  S = "S",
  Xl = "XL",
  Xs = "XS",
  Xxl = "XXL",
}



export type {
  IProductsResponse,
  IProduct
}
