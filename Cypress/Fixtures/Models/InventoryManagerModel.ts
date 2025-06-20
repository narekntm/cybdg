export enum productCategory {
    Select = 'Select...',
    Electronics = "Electronics",
    Books = "Books",
    Clothing = "Clothing",
    Other  = "Other",
}

export enum productStatus {
    Select = 'Select...',
    Available = "Available",
    OutOfStock = "OutOfStock",
    Discontinued = "Discontinued",
}

export interface Product {
    name: string;
    category: productCategory;
    quanity: number;
    status: productStatus;
}

export enum productsTableColumn {
    Name = 0,
    Category = 1,
    Quantity = 2,
    Status = 3,

}