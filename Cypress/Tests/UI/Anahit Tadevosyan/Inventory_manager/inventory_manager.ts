import {Product, productCategory, productsTableColumn, productStatus} from "Models/InventoryManagerModel";
import {InventoryManagerPage} from "Pages/InventoryManagerPage";

describe("InventoryManager", () => {
    const baseUrl = "http://127.0.0.1:8080/Resources/htmls/inventory_manager/"
    const categoryOptions = [productCategory.Select, productCategory.Electronics, productCategory.Books, productCategory.Clothing, productCategory.Other]
    const statusOptions = [productStatus.Select, productStatus.Available, productStatus.OutOfStock, productStatus.Discontinued]
    const testProduct: Product = {
        name: "TV",
        category: productCategory.Electronics,
        quanity: 34,
        status: productStatus.Available,
    }
    beforeEach('Visit the site', () => {
        cy.visit(baseUrl)
    })

    it('validates Product Category drop-down item', () => {
        InventoryManagerPage.getCategoryOptions().each((option, index) => {
            cy.wrap(option).should('have.text', categoryOptions[index]);
        })
    })

    it('validates Product Status drop-down items', () => {
        InventoryManagerPage.getStatusOptions().each((option, index) => {
            cy.wrap(option).should('have.text', statusOptions[index]);
        })
    })


    it('adds and verifies products', () => {
        InventoryManagerPage.nameInput().type(testProduct.name).should('have.value', testProduct.name)
        InventoryManagerPage.categorySelect().select(testProduct.category).should('have.value', testProduct.category)
        InventoryManagerPage.quantityInput().type(testProduct.quanity.toString()).should('have.value', testProduct.quanity.toString())
        InventoryManagerPage.statusSelect().select(testProduct.status).should('have.value', testProduct.status)
        InventoryManagerPage.submitButton().click()
        InventoryManagerPage.getCell(0, productsTableColumn.Name).should('have.text', testProduct.name)
        InventoryManagerPage.getCell(0, productsTableColumn.Category).should('have.text', testProduct.category)
        InventoryManagerPage.getCell(0, productsTableColumn.Quantity).should('have.text', testProduct.quanity.toString())
        InventoryManagerPage.getCell(0, productsTableColumn.Status).should('have.text', testProduct.status)
    })
})