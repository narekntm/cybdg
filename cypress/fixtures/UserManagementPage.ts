export class UserManagementPage {
    //admin section
    static adminTitle = () => cy.get('div#admin-controls').prev();
    static adminEmailLbl = () => cy.get('label[for="admin-email"]');
    static adminEmailInput = () => cy.get('input#admin-email');
    static adminPasswordLbl = () => cy.get('label[for="admin-password"]');
    static adminPasswordInput = () => cy.get('input#admin-password');
    static adminSubmitBtn = () => cy.get('form#user-form button.btn-primary[type="submit"]');
    static loggedStrog = () => cy.get('div#admin-controls strong');
    static loginStatus = () => cy.get('#login-status');
    static logoutBtn = () => cy.get('button#logout-btn');
    static adminError = () => cy.get('div#admin-delete-error');    

    //add New User section
    static formNewUserTitle = () => cy.get('section h2#form-title');

    static firstNameLbl = () => cy.get('label[for="name"]');
    static firstNameInput = () => cy.get('input#name');

    static roleLbl = () => cy.get('label[for="role"]');
    static roleSelect = () => cy.get('select#role');
    
    static ageLbl = () => cy.get('label[for="age"]');
    static ageInput = () => cy.get('input#age');

    static emailLbl = () => cy.get('label[for="email"]');        
    static emailInput = () => cy.get('input#email');   

    static genderTitle = () => cy.get('input[value="Male"]')
                                .parents('label')
                                .parent()
                                .siblings('label');        
    static genderMaleInput  = () => cy.get('input[value="Male"]'); 
    static genderFemaleInput  = () => cy.get('input[value="Female"]');        
    static genderOtherInput = () => cy.get('input[value="Other"]');  

    static subscribeTitle = () => cy.get('input[value="Newsletter"]')
                                    .parents('label')
                                    .parent()
                                    .siblings('label')
    static newsLetterInput  = () => cy.get('input[value="Newsletter"]');        
    static productUpdatesInput = () => cy.get('input[value="Product Updates"]');
    static userFormSubmitBtn  = () => cy.get('#user-form .btn-primary[type="submit"]');

    static userFormErrors = () =>  cy.get('div#form-errors');
    static nameError = () => cy.get('div#form-errors ul li:contains("Name must be 1–20 letters only (no spaces or symbols).")');
    static roleError = () => cy.get('div#form-errors ul li:contains("Role is required.")');
    static ageError = () => cy.get('div#form-errors ul li:contains("Age must be between 1 and 99.")');
    static emailError = () => cy.get('div#form-errors ul li:contains("Valid email is required.")');
    static genderError = () => cy.get('div#form-errors ul li:contains("Gender selection is required.")');


    //User Table
    static userTableRows  = () => cy.get('table#user-table tbody tr'); 
    static userTableColumnCount = () => cy.get('table#user-table tr').first().find('th');
    static userTableHeader = () => cy.get('table#user-table thead tr').first().find('th');
    static userTableRow  = () => cy.get('table#user-table tbody tr');

    
    static confirmModal = () => cy.get('#confirm-modal');
    static deleteModalTitle = () => cy.get('#confirm-modal div.modal-content p');
    static deleteModalCancelBtn = () => cy.get('#cancel-delete');
    static deleteModalConfirmBtn = () => cy.get('#confirm-delete');    
   
}