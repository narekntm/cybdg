import { UserManagementEndpoints } from 'EndPoints/UserManagementEndPoints';
import {UserData} from "Models/UserManagementModel";


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
    static EditUser(id: number){
        return cy.request({
            method: "PUT",
            url: UserManagementEndpoints.users(id),
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
