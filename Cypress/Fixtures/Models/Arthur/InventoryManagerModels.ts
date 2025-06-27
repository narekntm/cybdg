export enum ProductCategory {
  Electronics = "Electronics",
  Books = "Books",
  Clothing = "Clothing",
  Other = "Other",
}

export enum ProductStatus {
  Available = "Available",
  OutOfStock = "OutOfStock",
  Discontinued = "Discontinued",
}

export interface Product {
  name: string;
  category: ProductCategory;
  quantity: number;
  status: ProductStatus;
}
