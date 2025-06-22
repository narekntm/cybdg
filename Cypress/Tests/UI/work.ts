describe('Actions on Dom Elements', () => {
       context('Input', () =>{
        beforeEach(() =>{
         cy.visit("your-pge-url")
        });
        it('will check the input data', () => {
         cy.get('email').type("test@gmail.com");
         cy.get("email").should('have.test@gmail.com');
       })
       context('Checkbox', () =>{
        it('will check the Checkbox function', ()=>{
        cy.get('.action-checkboxes [type="checkbox"]').not('[disabled]').check()
        cy.get('.action-checkboxes [type="checkbox"]').not('[disabled]').should('be.checked')
        cy.get('.action-checkboxes [type="checkbox"]').not('[disabled]').uncheck()
        cy.get('.action-checkboxes [type="checkbox"]').not('[disabled]').should('not.be.checked')
       });
      
       })
       context('Paragraph', () =>{

       })
       
  })