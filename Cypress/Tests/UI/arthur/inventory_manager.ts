import { Product, ProductCategory, ProductStatus } from "Models/InventoryManagerModels";
import { InventoryManagerPage } from "Pages/InventoryManagerPage";

describe("Inventory Manager Test Scenarios", () => {
  const baseUrl = "http://127.0.0.1:8080/Resources/htmls/inventory_manager/";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("Should check options for ProductCategory select", () => {
    const expectedValues = Object.values(ProductCategory);
    InventoryManagerPage.categorySelect().should("be.visible");
    InventoryManagerPage.getCategoryOptions().should("have.length", expectedValues.length + 1);
    InventoryManagerPage.getCategoryOptions().each((option, index) => {
      if (index === 0) {
        expect(option).to.have.attr("value", "");
      } else {
        const value = option.text().trim();
        expect(value).to.be.oneOf(expectedValues);
      }
    });
  });

  it("Should check options for ProductStatus select", () => {
    const expectedValues = Object.values(ProductStatus);
    InventoryManagerPage.statusSelect().should("be.visible");
    InventoryManagerPage.getStatusOptions().should("have.length", expectedValues.length + 1);
    InventoryManagerPage.getStatusOptions().each((option, index) => {
      if (index === 0) {
        expect(option).to.have.attr("value", "");
      } else {
        const value = option.text().trim();
        expect(value).to.be.oneOf(expectedValues);
      }
    });
  });

  it("Should add a product and verify it in the table", () => {
    const product: Product = {
      name: "Harry Potter and the Lord of the Rings",
      category: ProductCategory.Books,
      quantity: 10,
      status: ProductStatus.Available,
    };

    InventoryManagerPage.nameInput().type(product.name);
    InventoryManagerPage.categorySelect().select(product.category);
    InventoryManagerPage.quantityInput().type(product.quantity.toString());
    InventoryManagerPage.statusSelect().select(product.status);
    InventoryManagerPage.submitButton().click();
    InventoryManagerPage.getRowByProductName(product.name).within(() => {
      cy.get("td").eq(0).should("have.text", product.name);
      cy.get("td").eq(1).should("have.text", product.category);
      cy.get("td").eq(2).should("have.text", product.quantity.toString());
      cy.get("td").eq(3).should("have.text", product.status);
    });
  });
});
