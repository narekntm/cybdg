import { UserManagementPage } from "Pages/UserManagementPage";
import { UserManagementMethods } from "../../../Fixtures/David Methods/UserManagementMethods";
import { SignIn } from "Models/David Models/UserManagementModels";

describe('Add New user section', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/Resources/htmls/CSS/user_management.html')
    })
    const name = "Joe";
    const email = "qwerty123@gmail.com";
    const age = 18;
    const role = "Admin";
    const gender = "Male";
    const subscribtion = "Product Updates";
    const status = "Active";

    context('Positive cases', () => {
        it('Should check all positive cases with this section', () => {
            UserManagementPage.secondSection().should('exist')
            UserManagementPage.nameField().type(name)
            UserManagementPage.nameField().should('have.value', name)
            UserManagementPage.roleField().select('')
            UserManagementPage.roleOptionAdmin().should('be.visible')
            UserManagementPage.roleOptionEditor().should('be.visible')
            UserManagementPage.roleOptionViewer().should('be.visible')
            UserManagementPage.roleField().select(role)
            UserManagementPage.roleField().should('have.value', role)
            UserManagementPage.ageField().type(age.toString())
            UserManagementPage.ageField().should('have.value', age)
            UserManagementPage.emailField().type(email)
            UserManagementPage.emailField().should('have.value', email)
            UserManagementPage.genderMaleRadioButton().should('not.be.checked').check()
            UserManagementPage.genderMaleRadioButton().should('be.checked')
            UserManagementPage.productUpdatesCheckbox().should('not.be.checked').check()
            UserManagementPage.productUpdatesCheckbox().should('be.checked')
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.nameField().should('not.have.value')
            UserManagementPage.roleField().should('not.have.value')
            UserManagementPage.ageField().should('not.have.value')
            UserManagementPage.emailField().should('not.have.value')
            UserManagementPage.genderMaleRadioButton().should('not.be.checked')
            UserManagementPage.genderFemaleRadioButton().should('not.be.checked')
            UserManagementPage.genderOtherRadioButton().should('not.be.checked')
            UserManagementPage.newsletterCheckbox().should('not.be.checked')
            UserManagementPage.productUpdatesCheckbox().should('not.be.checked')
            UserManagementPage.userTableRows().should('have.length', 4)
            UserManagementPage.fourthRowInUserTable().within(() => {
                UserManagementPage.nameDataUserTable().should('contain', name)
                UserManagementPage.roleDataUserTable().should('contain', role)
                UserManagementPage.ageDataUserTable().should('contain', age)
                UserManagementPage.emailDataUserTable().should('contain', email)
                UserManagementPage.genderDataUserTable().should('contain', gender)
                UserManagementPage.subscriptionDataUserTable().should('contain', subscribtion)
                UserManagementPage.statusDataUserTable().should('contain', status)
                UserManagementPage.editButtonInTable().should('exist')
                UserManagementPage.deleteButtonInTable().should('exist')
                UserManagementPage.userTableStatusChangeButton().should('exist')
            })
        })
    })
    context('Negative cases', () => {
        it('Empty fields', () => {
            UserManagementMethods.fillUserForm({})
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.nameFieldError().should('be.visible')
            UserManagementPage.roleFieldError().should('be.visible')
            UserManagementPage.ageFieldError().should('be.visible')
            UserManagementPage.emailFieldError().should('be.visible')
            UserManagementPage.genderFieldError().should('be.visible')
        })
        it('Only name', () => {
            UserManagementMethods.fillUserForm({name: "qwerty"})
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.roleFieldError().should('be.visible')
            UserManagementPage.ageFieldError().should('be.visible')
            UserManagementPage.emailFieldError().should('be.visible')
            UserManagementPage.genderFieldError().should('be.visible')
        })
        it('Name requirements', () => {
            UserManagementPage.nameField().type('    ')
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.nameFieldError().should('be.visible')
            UserManagementPage.nameField().clear()
            UserManagementPage.nameField().type('$Joe$')
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.nameFieldError().should('be.visible')
            UserManagementPage.nameField().clear()
            UserManagementPage.nameField().type('12345')
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.nameFieldError().should('be.visible')
            UserManagementPage.nameField().clear()
            UserManagementPage.nameField().type('qwertyqwertyqwertyqwerty')
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.nameFieldError().should('be.visible')
        })
        it('Without role', () => {
            UserManagementMethods.fillUserForm({name: "qwerty", age: "18", email: "qwerty@aa.aa", gender: "Male", subscribtion: "Newsletter"})
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.roleFieldError().should('be.visible')
        })
        it('Without age', () => {
            UserManagementMethods.fillUserForm({name: "qwerty", role: "Editor", email: "qwerty@aa.aa", gender: "Male", subscribtion: "Newsletter"})
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.ageFieldError().should('be.visible')
        })
        it('Age requirements', () => {
            UserManagementPage.ageField().type('   ')
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.ageFieldError().should('be.visible')
            UserManagementPage.ageField().clear()
            UserManagementPage.ageField().type('0')
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.ageFieldError().should('be.visible')
            UserManagementPage.ageField().clear()
            UserManagementPage.ageField().type('100')
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.ageFieldError().should('be.visible')
        })
        it('Without Email', () => {
            UserManagementMethods.fillUserForm({name: "qwerty", role: "Editor", age: "22", gender: "Male", subscribtion: "Newsletter"})
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.emailFieldError().should('be.visible')
        })
        it('Email requirements', () => {
            UserManagementPage.nameField().type('     ')
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.emailFieldError().should('be.visible')
            UserManagementPage.nameField().clear()
            UserManagementPage.nameField().type('aaaa@mail')
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.emailFieldError().should('be.visible')
            UserManagementPage.nameField().clear()
        })
        it('Without gender', () => {
            UserManagementMethods.fillUserForm({name: "qwerty", role: "Editor", age: "23", email: "qwerty@aa.aa", subscribtion: "Newsletter"})
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.genderFieldError().should('be.visible')
        })
    })
})
describe('User table section', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/Resources/htmls/CSS/user_management.html')
    })
    const uniqueName = 'Alicea';
    const uniqueRole = 'Editor';
    const uniqueAge = '33';
    const uniqueEmail = 'alice@site.com.com';

    context('Positive cases', () => {
        it('Should check user edit', () => {
            UserManagementPage.firstEditButtonInTable().click()
            UserManagementPage.nameField().should('have.value', 'Alice')
            UserManagementPage.roleField().should('have.value', 'Admin')
            UserManagementPage.ageField().should('have.value', 30)
            UserManagementPage.emailField().should('have.value', 'alice@site.com')
            UserManagementPage.genderFemaleRadioButton().should('be.checked')
            UserManagementPage.newsletterCheckbox().should('be.checked')
            UserManagementPage.nameField().clear().type(uniqueName)
            UserManagementPage.roleField().select(uniqueRole)
            UserManagementPage.ageField().clear().type(uniqueAge)
            UserManagementPage.emailField().clear().type(uniqueEmail)
            UserManagementPage.genderOtherRadioButton().check()
            UserManagementPage.newsletterCheckbox().uncheck()
            UserManagementPage.productUpdatesCheckbox().check()
            UserManagementPage.addNewUserSaveButton().click()
            UserManagementPage.firstRowInUserTable().within(() => {
                UserManagementPage.nameDataUserTable().should('contain', uniqueName)
                UserManagementPage.roleDataUserTable().should('contain', uniqueRole)
                UserManagementPage.ageDataUserTable().should('contain', uniqueAge)
                UserManagementPage.emailDataUserTable().should('contain', uniqueEmail)
                UserManagementPage.genderDataUserTable().should('contain', 'Other')
                UserManagementPage.subscriptionDataUserTable().should('contain', 'Product Updates')
                UserManagementPage.statusDataUserTable().should('contain', 'Active')
            })
            UserManagementPage.userTableFirstStatusChangeButton().click()
            UserManagementPage.firstRowInUserTable().within(() => {
                UserManagementPage.statusDataUserTable().should('contain', 'Inactive')
            })
        })
        it('Should delete user', () => {
            UserManagementPage.userTableSecondDeleteButton().click()
            UserManagementPage.popUpConfirmDeleteButton().click()
            UserManagementPage.userTableRows().should('have.length', 2)
        })
    })
    context('Negative cases', () => {
        it('Delete admin', () => {
            UserManagementPage.userTableFirstDeleteButton().click()
            UserManagementPage.adminDeleteError().should('have.text', 'Admin login required to delete Admin-level users.')
        })
    })
})
describe('Auth', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/Resources/htmls/CSS/user_management.html')
    })
    const login = 'admin@example.com';
    const password = 'admin123';
    
    context('Negative cases', () => {
        it('Empty fields', () => {
            UserManagementMethods.Auth({})
            UserManagementPage.invalidCredentials().should('be.visible')
        })
        it('Wrong email', () => {
            UserManagementMethods.Auth({password: password})
            UserManagementPage.invalidCredentials().should('be.visible')
        })
        it('Wrong password', () => {
            UserManagementMethods.Auth({email: login})
            UserManagementPage.invalidCredentials().should('be.visible')
        })
    })
    context('Positive cases', () => {
        it('Should log in and delete admin', () => {
            UserManagementMethods.Auth({email: login, password: password})
            UserManagementPage.logoutButton().should('be.visible')
            UserManagementMethods.adminUserDeleteAsAdmin()
            UserManagementMethods.logout()
        })
    })
})