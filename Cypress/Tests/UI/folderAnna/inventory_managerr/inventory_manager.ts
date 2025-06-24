import { ProductCategory , ProductStatus } from "Models/InventoryManagerModels";
import { InventoryManagerPage } from "Pages/InventoryManagerPage";

describe("Inventory Manager", () => {
  const url = "/Resources/htmls/inventory_manager/index.html";
  beforeEach(() => {
    cy.visit(url);
  });


  describe("Validate Dropdowns", () => {
    it("should show validation messages when submitting an empty form", () => {
      InventoryManagerPage.submitButton().click();

      InventoryManagerPage.errorName().should("contain", "Product name is required.");
      InventoryManagerPage.errorCategory().should("contain", "Please select a category.");
      InventoryManagerPage.errorQuantity().should("contain", "Quantity must be at least 1.");
      InventoryManagerPage.errorStatus().should("contain", "Please select a status.");
  
      InventoryManagerPage.tableRows().should("have.length", 0); 
    });
  
    it("Should Check the data on the Category dropdown", () => {
      const options = [ProductCategory.Select, ProductCategory.Electronics, ProductCategory.Books,ProductCategory.Clothing, ProductCategory.Other,];
      InventoryManagerPage.getCategoryOptions().each(($option, i) => {
        expect($option.text().trim()).to.equal(options[i]);
      });
    });
    it("Should check the data on the Status dropdown", () => {
      const options = [ProductStatus.Select, ProductStatus.Available, ProductStatus.OutOfStock, ProductStatus.Discontinued];
      InventoryManagerPage.getStatusOptions().each(($option, i) => {
        expect($option.text().trim()).to.equal(options[i]);
      });
    });
  });
  it("Add and Verify Product", () => {
    
    const product = {
      name: "dynamic",
      category: ProductCategory.Electronics,
      quantity: 9,
      status: ProductStatus.Available,
    };

  
  
      InventoryManagerPage.nameInput().clear().type(product.name);
      InventoryManagerPage.categorySelect().select(product.category);
      InventoryManagerPage.quantityInput().clear().type(product.quantity.toString());
      InventoryManagerPage.statusSelect().select(product.status);
      InventoryManagerPage.submitButton().click()
  
      InventoryManagerPage.rowProductName(product.name).within(() => {
        InventoryManagerPage.getCell(0).should("contain", product.name);
        InventoryManagerPage.getCell(1).should("contain", product.category);
        InventoryManagerPage.getCell(2).should("contain", product.quantity.toString());
        InventoryManagerPage.getCell(3).should("contain", product.status);
    });
  });
});