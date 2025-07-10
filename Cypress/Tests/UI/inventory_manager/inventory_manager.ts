import { InventoryManagerPage } from "Pages/anahit-tadevosyan/InventoryManagerPage";

enum ProductCategory {
  Electronics = "Electronics",
  Books = "Books",
  Clothing = "Clothing",
  Other = "Other",
}

enum ProductStatus {
  Available = "Available",
  OutOfStock = "OutOfStock",
  Discontinued = "Discontinued",
}

interface Product {
  name: string;
  category: ProductCategory;
  quantity: number;
  status: ProductStatus;
}

type ProductField = keyof Product;

describe("Inventory Manager – Advanced TypeScript UI Tests", () => {
  const url = "http://127.0.0.1:8080/Resources/htmls/inventory_manager/index.html";

  beforeEach(() => {
    cy.visit(url);
  });

  it("should validate category and status dropdown values match enums", () => {
    validateSelectOptions(InventoryManagerPage.categorySelect, Object.values(ProductCategory));
    validateSelectOptions(InventoryManagerPage.statusSelect, Object.values(ProductStatus));
  });

  it("should add multiple products and verify each table row content", () => {
    const products: Product[] = [
      {
        name: "Laptop",
        category: ProductCategory.Electronics,
        quantity: 5,
        status: ProductStatus.Available,
      },
      {
        name: "T-Shirt",
        category: ProductCategory.Clothing,
        quantity: 12,
        status: ProductStatus.OutOfStock,
      },
      {
        name: "Novel",
        category: ProductCategory.Books,
        quantity: 7,
        status: ProductStatus.Discontinued,
      },
    ];

    products.forEach((product) => {
      fillProductForm(product);
      InventoryManagerPage.submitButton().click();
    });

    InventoryManagerPage.tableRows().should("have.length.at.least", products.length);

    products.forEach((product) => {
      InventoryManagerPage.getRowByProductName(product.name).within(() => {
        InventoryManagerPage.getCell(0).should("contain", product.name);
        InventoryManagerPage.getCell(1).should("contain", product.category);
        InventoryManagerPage.getCell(2).should("contain", product.quantity.toString());
        InventoryManagerPage.getCell(3).should("contain", product.status);
      });
    });
  });

  it("should block submission when required fields are empty", () => {
    InventoryManagerPage.nameInput().clear();
    InventoryManagerPage.categorySelect().select("");
    InventoryManagerPage.quantityInput().clear();
    InventoryManagerPage.submitButton().click();

    InventoryManagerPage.tableRows().should("have.length", 0);
  });

  it("should submit various combinations using enum matrix and verify last row", () => {
    Object.values(ProductCategory).forEach((category, index) => {
      const product: Product = {
        name: `Test Product ${index + 1}`,
        category,
        quantity: index + 1,
        status: Object.values(ProductStatus)[index % 3],
      };

      fillProductForm(product);
      InventoryManagerPage.submitButton().click();

      InventoryManagerPage.getLastRow().within(() => {
        InventoryManagerPage.getCell(0).should("contain", product.name);
        InventoryManagerPage.getCell(1).should("contain", product.category);
        InventoryManagerPage.getCell(2).should("contain", product.quantity.toString());
        InventoryManagerPage.getCell(3).should("contain", product.status);
      });
    });
  });

  it("should show validation messages when submitting an empty form", () => {
    InventoryManagerPage.submitButton().click();

    InventoryManagerPage.errorName().should("contain", "Product name is required.");
    InventoryManagerPage.errorCategory().should("contain", "Please select a category.");
    InventoryManagerPage.errorQuantity().should("contain", "Quantity must be at least 1.");
    InventoryManagerPage.errorStatus().should("contain", "Please select a status.");

    InventoryManagerPage.tableRows().should("have.length", 0);
  });

  it("should clear validation messages after providing valid input", () => {
    InventoryManagerPage.submitButton().click(); // trigger errors

    InventoryManagerPage.nameInput().type("Valid Name");
    InventoryManagerPage.categorySelect().select(ProductCategory.Books);
    InventoryManagerPage.quantityInput().clear().type("3");
    InventoryManagerPage.statusSelect().select(ProductStatus.Available);
    InventoryManagerPage.submitButton().click();

    InventoryManagerPage.errorName().should("have.text", "");
    InventoryManagerPage.errorCategory().should("have.text", "");
    InventoryManagerPage.errorQuantity().should("have.text", "");
    InventoryManagerPage.errorStatus().should("have.text", "");

    InventoryManagerPage.tableRows().should("have.length", 1);
  });

  it("should verify table row content using ProductField and dynamic cell mapping", () => {
    const product: Product = {
      name: "FieldMapped",
      category: ProductCategory.Other,
      quantity: 99,
      status: ProductStatus.Available,
    };

    fillProductForm(product);
    InventoryManagerPage.submitButton().click();

    InventoryManagerPage.getLastRow().then((row) => {
      (Object.keys(product) as ProductField[]).forEach((field, index) => {
        const expectedValue = product[field].toString();
        cy.wrap(row).within(() => {
          InventoryManagerPage.getCell(index).should("contain", expectedValue);
        });
      });
    });
  });

  // ────────────────────────────────────────────────────────────────────────────────

  function fillProductForm(product: Product): void {
    InventoryManagerPage.nameInput().clear().type(product.name);
    InventoryManagerPage.categorySelect().select(product.category);
    InventoryManagerPage.quantityInput().clear().type(product.quantity.toString());
    InventoryManagerPage.statusSelect().select(product.status);
  }

  function validateSelectOptions(getElement: () => Cypress.Chainable<JQuery<HTMLElement>>, expected: string[]): void {
    getElement().then(($select) => {
      const selectEl = $select[0] as HTMLSelectElement;
      const actual = Array.from(selectEl.options)
        .map((o) => o.text)
        .filter(Boolean);
      expected.forEach((val) => {
        expect(actual).to.include(val);
      });
    });
  }
});
