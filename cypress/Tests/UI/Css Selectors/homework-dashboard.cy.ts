describe('Admin Dashboard', () => {
  beforeEach(() =>{
    cy.visit (file:///Users/vahagnyeghoyan/Desktop/Project/cybdg/Resources/htmls/CSS/homework.html
        )
  it('should be filled and submited correctly', () => {
    cy.get('input[name='Username']').type('testuser');
    cy.get('input[name='Email']').type('testuser@example.com');
    cy.get('select[name='role']').select('editor');
    cy.get('input[name='Subscribe to newsletter']').check();
    cy.get('button[type='Submit']').click();
  });
  it('should validate row actions and button states', () => {
    cy.get('table tbody tr').should('have.length', 3);
    cy.get('table tbody tr').eq(0).find('button.edit-btn').click();
    cy.get('table tbody tr').eq(1).find('button.edit-btn').click();
    cy.get('table tbody tr').eq(2).find('button.edit-btn').should('be.disabled');
  });
})
