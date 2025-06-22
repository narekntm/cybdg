export class InventoryManagerPage {
  // Form elements
  static form = () => cy.get("#add-product-form");

  static nameInput = () => cy.get("#product-name");
  static categorySelect = () => cy.get("#product-category");
  static quantityInput = () => cy.get("#product-quantity");
  static statusSelect = () => cy.get("#product-status");
  static submitButton = () => cy.get('form button[type="submit"]');

  // Error messages
  static errorName = () => cy.get("#error-name");
  static errorCategory = () => cy.get("#error-category");
  static errorQuantity = () => cy.get("#error-quantity");
  static errorStatus = () => cy.get("#error-status");

  // Table rows
  static tableRows = () => cy.get("#inventory-table tbody tr");
  static tableLastRow= () => cy.get("#inventory-table tbody tr").last();
  static rowProductName = (name: string) => cy.get("#inventory-table tbody tr").contains("td", name).parent("tr");
  static fieldNameColumn = () => cy.get("td").eq(0);
  static fieldCategoryColumn= () => cy.get("#inventory-table tbody td").eq(1);
  static fieldQuantityColumn= () => cy.get("#inventory-table tbody td").eq(2);
  static fieldStatusColumn= () => cy.get("#inventory-table tbody td").eq(3);

  static getCell = (index: number) => cy.get("#inventory-table tbody td").eq(index);

  // Select options
  static getCategoryOptions = () => cy.get("#product-category option");
  static getStatusOptions = () => cy.get("#product-status option");
  static getStatuses = () => cy.get("#product-status");
}