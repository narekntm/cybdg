import { Columns, UserRole} from "Cypress/Fixtures/Models/UserManagementModels";

function getInfoValue(labelText: string) {
  return cy
    .contains('.info-row label', labelText)
    .parent('.info-row')
    .find('.value');
}

export class UserManagementPageV2 {
    //Login section
    static loginBtn = () => cy.get('button#open-login-modal');
    static adminModal = () => cy.get('#admin-login-modal > .modal-content');
    static adminTitle = () => cy.get('#admin-login-modal > .modal-content > h2');
    static adminEmailLbl = () => cy.get('label[for="admin-email"]');
    static adminEmailInput = () => cy.get('input#admin-email');
    static adminPasswordLbl = () => cy.get('label[for="admin-password"]');
    static adminPasswordInput = () => cy.get('input#admin-password');
    static adminSubmitBtn = () => cy.get('form#admin-login-form-modal button[type="submit"]');
    static adminCancelBtn = () => cy.get('.modal-content > #close-login-modal');
    static logoutBtn = () => cy.get('button#logout-btn');
    static adminStatus = () => cy.get('#admin-status-text');
    static loginStatus = () => cy.get('#login-status');

    //add New User section
    static userCard = () => cy.get('#user-card');
    static addNewUserBtn = () => cy.get('#open-user-modal');
    static newUserModal = () => cy.get('.modal#user-form-modal');
    static newUserTitle = () => cy.get('#form-title');
    static fullNameLbl = () => cy.get('label[for="name"]');
    static fullNameInput = () => cy.get('input#name');
    static roleLbl = () => cy.get('label[for="role"]');
    static roleSelect = () => cy.get('select#role');
    static ageLbl = () => cy.get('label[for="age"]');
    static ageInput = () => cy.get('input#age');
    static emailLbl = () => cy.get('label[for="email"]');
    static emailInput = () => cy.get('input#email'); 
    static genderTitle = () => cy.get('input[value="Male"]').parents('label').parent().siblings('label');
    static genderInput = (gender: string) => cy.get(`input[value="${gender}"]`);
    static subscribeTitle = () => cy.get('input[value="Newsletter"]').parents('label').parent().siblings('label');
    static subscriptionInput = (subscription: string) => cy.get(`input[value="${subscription}"]`);
    static userFormSubmitBtn = () => cy.get('.form-group-inline > .btn-primary[type="submit"]');
    static userFormCancelBtn = () => cy.get('.form-group-inline > #close-user-modal');
    static userFormErrors = () => cy.get('div#form-errors');
    static toastContainer = () => cy.get('#toast-container');
    static adminDeleteError = () => cy.get('#admin-delete-error');

    //view user
    static userProfileModal = () => cy.get('#user-card');

    static userImg  = () => cy.get('#profile-pic');
    static userCaption = () => cy.get('#user-name');

    static userNameLbl = () => cy.get('.info-row label[for="name"]');
    static userNameText = () => getInfoValue('Name:');
    static userNameInput = () => cy.get('.info-row #name');

    static userRoleLbl = () => cy.get('.info-row label[for="role"]');
    static userRole = () =>  getInfoValue('Role:');
    static userRoleSelect = () => cy.get('.info-row #role');    

    static userAgeLbl = () => cy.get('.info-row label[for="age"]');
    static userAgeText = () => getInfoValue('Age:');
    static userAgeInput = () => cy.get('.info-row #age');       

    static userEmailLbl = () => cy.get('.info-row label[for="email"]');
    static userEmailText = () =>  getInfoValue('Email:');
    static userEmailInput = () => cy.get('.info-row #email');       

    static userGenderLbl = () => cy.get('.info-row label[for="gender"]');
    static userGenderText = () => getInfoValue('Gender:');
    static userGenderSelect = () => cy.get('.info-row #gender');

    static userSubscriptionsLbl = () => cy.get('.info-row label[for="subscriptions"]');
    static userSubscriptionsText = () =>  getInfoValue('Subscriptions:');
    static userSubscriptionInput = (subscription: string) => cy.get(`input[value="${subscription}"]`);

    static userStatusLbl = () => cy.get('.info-row label[for="status"]');
    static userStatusText = () =>  getInfoValue('Status:');
    static userStatusSelect = () => cy.get('.info-row #status');     

    static viewBackBtn = () => cy.get('#back-btn');
    static viewEditBtn = () => cy.get('#edit-btn');

    static editCancelBtn = () => cy.get('#cancel-btn');
    static editSaveBtn = () => cy.get('#save-btn');    

    static nameError = () => cy.get('div#form-errors ul li:contains("Name must be 1–20 letters only (no spaces or symbols).")');
    static roleError = () => cy.get('div#form-errors ul li:contains("Role is required.")');
    static ageError = () => cy.get('div#form-errors ul li:contains("Age must be between 1 and 99.")');
    static emailError = () => cy.get('div#form-errors ul li:contains("Valid email is required.")');
    static genderError = () => cy.get('div#form-errors ul li:contains("Gender selection is required.")');

    //User Table
    static userTableRows = () => cy.get('table#user-table tbody tr'); 
    static userTableRow = (row: number) => cy.get('table#user-table tbody tr').eq(row);
    static userTableRowTds = (row: number) => cy.get('table#user-table tbody tr').eq(row).find('td');
    static userTableRoleColumnTd = (row: number) => cy.get('table#user-table tbody tr').eq(row).find('td').eq(Columns.Role);

    static userTableRowEditButton = (row: number) => cy.get('table#user-table tbody tr').eq(row).find('td').find("button.edit-btn");
    static userTableRowViewButton = (row: number) => cy.get('table#user-table tbody tr').eq(row).find('td').find("a.btn-neutral");    
    static userTableRowDeleteButton = (row: number) => cy.get('table#user-table tbody tr').eq(row).find('td').find("button.delete-btn");
    static userTableRowStatusButton = (row: number) => cy.get('table#user-table tbody tr').eq(row).find('td').find("button.status-btn");

    static userTableRowAdminDeleteButton = () => UserManagementPageV2.userTableRows().contains(UserRole.Admin).eq(0).parent().find('td').find("button.delete-btn");

    static userTableColumnCount = () => cy.get('table#user-table tr').first().find('th');
    static userTableHeader = () => cy.get('table#user-table thead tr').first().find('th');
    static userTableHeaderTd = ($el: JQuery<HTMLElement>) => cy.wrap($el); 
    
    static confirmModal = () => cy.get('#confirm-delete-modal');
    static deleteModalTitle = () => cy.get('#confirm-delete-modal div.modal-content p');
    static deleteModalCancelBtn = () => cy.get('#cancel-delete');
    static deleteModalConfirmBtn = () => cy.get('#confirm-delete');

    static resetBtn = () => cy.get('#reset-btn');
    static resetModalConfirmBtn = () => cy.get('#confirm-reset');
    static resetModalCancelBtn = () => cy.get('#cancel-reset');

    //pagination
    static paginationBar = () => cy.get('#pagination-controls');
    static prevPageBtn = () => cy.get('#prev-page');
    static nextPageBtn = () => cy.get('#next-page');
    static pageInfo = () => cy.get('#page-info');
}