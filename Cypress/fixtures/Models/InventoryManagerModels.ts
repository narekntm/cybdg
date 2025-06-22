export enum ProductCategory {
    Select = "Select",
    Electronics = "Electronics",
    Books = "Books",
    Clothing = "Clothing",
    Other = "Other",
  }
  
  export enum ProductStatus {
    Select = "Select",
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