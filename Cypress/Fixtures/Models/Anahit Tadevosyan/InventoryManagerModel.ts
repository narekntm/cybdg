export enum productCategory {
  Select = "",
  Electronics = "Electronics",
  Books = "Books",
  Clothing = "Clothing",
  Other = "Other",
}

export enum productStatus {
  Select = "",
  Available = "Available",
  OutOfStock = "OutOfStock",
  Discontinued = "Discontinued",
}

export interface Product {
  name: string;
  category: productCategory;
  quantity: number;
  status: productStatus;
}

export enum productsTableColumn {
  Name = 0,
  Category = 1,
  Quantity = 2,
  Status = 3,
}
