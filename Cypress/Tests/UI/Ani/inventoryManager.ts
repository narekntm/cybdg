import { ProductCategory, ProductStatus } from "Cypress/Fixtures/Models/InventoryManagerModels";
import { InventoryManagerPage } from "Cypress/Fixtures/Pages/InventoryManagerPage";

describe("Inventory Manager", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:8080/Resources/htmls/inventory_manager/index.html");
  });
  describe("Validate Dropdowns", () => {
    it("1. Check the data on the Category dropdown", () => {
      const options = [
        ProductCategory.select,
        ProductCategory.electronics,
        ProductCategory.books,
        ProductCategory.clothing,
        ProductCategory.other,
      ];
      InventoryManagerPage.getCategoryOptions().each(($option, index) => {
        expect($option.text().trim()).to.equal(options[index]);
      });
    });
    it("2. Check the data on the Status dropdown", () => {
      const options = [ProductStatus.select, ProductStatus.available, ProductStatus.outOfStock, ProductStatus.discontinued];
      InventoryManagerPage.getStatusOptions().each(($option, index) => {
        expect($option.text().trim()).to.equal(options[index]);
      });
    });
  });
  it("Add and Verify Product", () => {
    const product = {
      name: "Ball",
      category: "Other",
      quantity: "4",
      status: "Available",
    };
    InventoryManagerPage.nameInput().type(product.name);
    InventoryManagerPage.categorySelect().select(product.category);
    InventoryManagerPage.quantityInput().type(product.quantity);
    InventoryManagerPage.getStatuses().select(product.status);
    InventoryManagerPage.submitButton().click();
    InventoryManagerPage.getRowByProductName(product.name).within(() => {
      InventoryManagerPage.getNameColumn().should("have.text", product.name);
      InventoryManagerPage.getCategoryColumn().should("have.text", product.category);
      InventoryManagerPage.getQuantityColumn().should("have.text", product.quantity);
      InventoryManagerPage.getStatusColumn().should("have.text", product.status);
    });
  });
});
