export enum ProductCategory {
  Select = "",
  Electronics = "Electronics",
  Books = "Books",
  Clothing = "Clothing",
  Other = "Other",
}

export enum ProductStatus {
  Select = "",
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

export enum ProductsTableColumn {
  Name = 0,
  Category = 1,
  Quantity = 2,
  Status = 3,
}
