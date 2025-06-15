import { UserManagementPage } from "./UserManagementPage"

export class UserManagementMethods {
    // Auth part
    static successAuth = (email: string, password: string) => {
        UserManagementPage.adminEmailInput().type(email)
        UserManagementPage.adminPasswordInput().type(password)
        UserManagementPage.adminSubmitButton().click()
        UserManagementPage.successSignInMessage()
    }
    static adminUserDeleteAsAdmin = () => {
        UserManagementPage.userTableFirstDeleteButton().click()
        UserManagementPage.popUpConfirmDeleteButton().click()
        UserManagementPage.userTableRows().should('have.length', 2)
    }
    static logout = () => {
        UserManagementPage.logoutButton().click()
        UserManagementPage.successSignInMessage().should('not.be.visible')
    }
}