import { UserManagementEndpoints } from 'EndPoints/Anahit Tadevosyan/UserManagementEndPoints';
import {UserData} from "Models/Anahit Tadevosyan/UserManagementModel";


export class UserManagementBuilders{
    static AdminLogin = (email: string, password: string) => {
        return cy.request({
            method: "POST",
            url: UserManagementEndpoints.adminLogin(),
            body: {
                email,
                password
            },
            failOnStatusCode: false,
        })
    };

    static ResetData() {
        return cy.request({
            method: "POST",
            url: UserManagementEndpoints.reset(),
        });
    }
    static GetUsers() {
        return cy.request({
            method: "GET",
            url: UserManagementEndpoints.users(),
            failOnStatusCode: false,
        });
    }
    static AddUser(user: UserData){
        return cy.request({
            method: "POST",
            url: UserManagementEndpoints.users(),
            body: user,
            failOnStatusCode:false,

        })
}
    static EditUser(id: number, editedUser: UserData){
        return cy.request({
            method: "PUT",
            url: UserManagementEndpoints.users(id),
            body: editedUser,
            failOnStatusCode:false,
        })
    }

    static DeleteUser(id: number, isAdmin: true | false) {
        return cy.request({
            method: "DELETE",
            url: UserManagementEndpoints.users(id),
            body: {
                isAdmin
            },
            failOnStatusCode: false,
        });

    }
    static ChangeUserStatus(id: number, status: "Active" | "Inactive") {
        return cy.request({
            method: "PATCH",
            url: UserManagementEndpoints.status(id),
            body: { status },
            failOnStatusCode: false,
        });
    }

}
