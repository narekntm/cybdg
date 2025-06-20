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
  static getLastRow = () => cy.get("#inventory-table tbody tr").last();
  static getRowByProductName = (name: string) => cy.get("#inventory-table tbody tr").contains("td", name).parent("tr");

  static getCell = (index: number, cell:number) =>cy.get("#inventory-table tbody tr").eq(index).find("td").eq(cell);

  // Select options
  static getCategoryOptions = () => cy.get("#product-category option");
  static getStatusOptions = () => cy.get("#product-status option");
}
