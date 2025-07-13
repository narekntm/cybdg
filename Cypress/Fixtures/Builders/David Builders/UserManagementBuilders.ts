import { UserManagementEndPoints } from "Cypress/Fixtures/EndPoints/David EndPoints/UserManagementEndPoints"
import { NewUser } from "Models/David Models/UserManagementModels"
import { UserManagementModels } from "Models/Lecture/UserManagementModels";
import User = UserManagementModels.User;

export class UserManagementBuilders {
    static AdminLogin = (email : string, password: string) => {
        return cy.request({
            method: "POST",
            url: UserManagementEndPoints.adminLogin,
            body: {
                email,
                password
            },
            failOnStatusCode: false
        })
    }
    static ResetData = () => {
        return cy.request({
            method: "POST",
            url: UserManagementEndPoints.reset
        })
    }
    static GetUsers = (id ?: number) => {
        return cy.request({
            method: "GET",
            url: UserManagementEndPoints.Users()
        })
    }
    static PostUser = (userData : NewUser) => {
        return cy.request({
            method: "POST",
            url: UserManagementEndPoints.Users(),
            failOnStatusCode: false,
            body: userData
        })
    }
    static UpdateUser = (id: number, userData : Partial<NewUser>) => {
        return cy.request({
            method: "PUT",
            url: UserManagementEndPoints.Users(id),
            body: userData
        })
    }
    static DeleteUser = (id: number) => {
        return cy.request({
            method: "DELETE",
            url: UserManagementEndPoints.Users(id),
            body: {
                isAdmin: false
            },
            failOnStatusCode: false
        })
    }
    static ChangeStatus = (id: number, status: string) => {
        return cy.request({
            method: "PATCH",
            url: UserManagementEndPoints.Status(id),
            body: {
                status: status
            }
        })
    }
    static seedData = (users: UserManagementModels.User[]) => {
        return cy.request({
            method: "POST",
            url: UserManagementEndPoints.Seed(),
            body : {users, overwrite: false},
        })
    }
}