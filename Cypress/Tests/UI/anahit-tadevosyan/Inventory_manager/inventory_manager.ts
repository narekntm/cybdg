import { Product, ProductCategory, ProductStatus } from "Models/anahit-tadevosyan/InventoryManagerModel";
import { InventoryManagerPage } from "Pages/anahit-tadevosyan/InventoryManagerPage";

describe("InventoryManager", () => {
  const baseUrl = "http://127.0.0.1:8080/Resources/htmls/inventory_manager/";
  const categoryOptions = [
    ProductCategory.Select,
    ProductCategory.Electronics,
    ProductCategory.Books,
    ProductCategory.Clothing,
    ProductCategory.Other,
  ];
  const statusOptions = [ProductStatus.Select, ProductStatus.Available, ProductStatus.OutOfStock, ProductStatus.Discontinued];
  const testProduct: Product = {
    name: "TV",
    category: ProductCategory.Electronics,
    quantity: 34,
    status: ProductStatus.Available,
  };
  beforeEach("Visit the site", () => {
    cy.visit(baseUrl);
  });

  it("validates Product Category drop-down item", () => {
    InventoryManagerPage.getCategoryOptions().each((option, index) => {
      cy.wrap(option).should("have.value", categoryOptions[index]);
    });
  });

  it("validates Product Status drop-down items", () => {
    InventoryManagerPage.getStatusOptions().each((option, index) => {
      cy.wrap(option).should("have.value", statusOptions[index]);
    });
  });

  it("adds and verifies products", () => {
    InventoryManagerPage.nameInput().type(testProduct.name).should("have.value", testProduct.name);
    InventoryManagerPage.categorySelect().select(testProduct.category).should("have.value", testProduct.category);
    InventoryManagerPage.quantityInput().type(testProduct.quantity.toString()).should("have.value", testProduct.quantity.toString());
    InventoryManagerPage.statusSelect().select(testProduct.status).should("have.value", testProduct.status);
    InventoryManagerPage.submitButton().click();
  });
});
