import {UserManagementEndpoints} from "../EndPoints/UserManagementEndPoints"
export class UserManagementBuilders{
    static AdminLogin = (email: string, password: string) =>
       return cy.request({
            method: "POST",
            url: UserManagementEndpoints.adminlogin,
            body: {
                email,
                password,
            }
            failOnStatusCode:false
        })
}