import { UserManagementEndpoints } from "EndPoints/UserManagementEndPoints";
import { UserManagementBuilders } from "Builders/UserManagementBuilders";
import { UserManagementPage } from "Pages/UserManagementPage";

describe('User Management API Testing', () => {
    const baseUrl = "http://127.0.0.1:3000/";

    beforeEach(() => {
        cy.visit(baseUrl);
    });
    afterEach(() => {
    UserManagementBuilders.ResetData()
    })
    describe('User Table Manipulations', () => {
        it('Delete user as admin', ()=>{
            UserManagementBuilders.AdminLogin('admin@example.com', 'admin123').then((response) => {
                expect(response.status).to.eq(200)
            })
            UserManagementBuilders.DeleteUser(2, true).then((response) => {
                expect(response.status).to.eq(200)
            })

            UserManagementBuilders.GetUsers().then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.not.include("Eve")
            })

        })
        it('Delete user as non-admin', ()=>{
            it('Delete user as admin', ()=>{
                UserManagementBuilders.AdminLogin('admin@example.com', 'admin').then((response) => {
                    expect(response.status).to.eq(401)
                })
                UserManagementBuilders.DeleteUser(2, true).then((response) => {
                    expect(response.status).to.eq(200)
                })

                UserManagementBuilders.GetUsers().then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.not.include("Eve")
                })

            })
            UserManagementBuilders.DeleteUser(2, true).then((response) => {
                expect(response.status).to.eq(200)
            })

            UserManagementBuilders.GetUsers().then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.not.include("Eve")
            })

        })
        it('Delete admin as non admin', ()=>{
            UserManagementBuilders.DeleteUser(1, false).then((response) => {
                expect(response.status).to.eq(403)
            })
        })
        it('Delete admin as admin', ()=>{
            UserManagementBuilders.AdminLogin('admin@example.com', 'admin123').then((response) => {
                expect(response.status).to.eq(200)
            })
           return  UserManagementBuilders.DeleteUser(1, true).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.not.include("Alice")
            })
        })

    })
    it('Change the toggle to Inactive', () => {
        UserManagementBuilders.ChangeUserStatus(3, "Inactive").then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.include({
                "id": 3,
                "name": "Eve",
                "role": "Editor",
                "age": 28,
                "email": "eve@site.com",
                "gender": "Other",
                "subscriptions": "Newsletter, Product Updates",
                "status": "Inactive"
            })

        })

        it('Change the toggle to Active', () => {
            UserManagementBuilders.ChangeUserStatus(2, "Active").then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.include({
                    "id": 2,
                    "name": "Bob",
                    "role": "Viewer",
                    "age": 25,
                    "email": "bob@site.com",
                    "gender": "Male",
                    "subscriptions": "Product Updates",
                    "status": "Active"
                })

            })
        })
    })
});
