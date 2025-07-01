import { UserManagementBuilders } from "Builders/David Builders/UserManagementBuilders";
import { NewUser } from "Models/David Models/UserManagementModels";


describe("Users tests", () => {
    beforeEach(() => {
        UserManagementBuilders.ResetData()
    })

    context("Users negatives", () => {
        const withoutName: NewUser = {age: "18", role: "Editor", email: "qwerty@mail.ru", gender: "Male", subscribtion: "Newsletter"}
        const withoutAge: NewUser = {name: "Test User", role: "Editor", email: "qwerty@mail.ru", gender: "Male", subscribtion: "Newsletter"}
        const withoutRole: NewUser = {name: "Test User", age: "22", email: "qwerty@mail.ru", gender: "Male", subscribtion: "Newsletter"}
        const withoutEmail: NewUser = {name: "Test User", age: "22", role: "Editor", gender: "Male", subscribtion: "Newsletter"}
        const withoutGender: NewUser = {name: "Test User", age: "22", role: "Editor", email: "qwerty@mail.ru", subscribtion: "Newsletter"}
        const registratedEmailUser: NewUser = {name: "Test", age: "22", role: "Editor", gender: "Male", email: "alice@site.com", subscribtion: "Newsletter"}

        it('Should check user create without name', () => {
            UserManagementBuilders.PostUser(withoutName).then(xhr => {
                expect(xhr.status).to.eq(400)
                expect(xhr.body).to.deep.equal({errors: ["Name must be 1–20 letters only (no spaces or symbols)."]})
            })
        })
        it('Should check user create without age', () => {
            UserManagementBuilders.PostUser(withoutAge).then(xhr => {
                expect(xhr.status).to.eq(400)
                expect(xhr.body.errors).to.include("Age must be between 1 and 99.")
            })
        })
        it('Should check user create without role', () => {
            UserManagementBuilders.PostUser(withoutRole).then(xhr => {
                expect(xhr.status).to.eq(400)
                expect(xhr.body.errors).to.include("Role is required.")
            })
        })
        it('Should check user create without email', () => {
            UserManagementBuilders.PostUser(withoutEmail).then(xhr => {
                expect(xhr.status).to.eq(400)
                expect(xhr.body.errors).to.include("Valid email is required.")
            })
        })
        it('Should check user create without gender', () => {
            UserManagementBuilders.PostUser(withoutGender).then(xhr => {
                expect(xhr.status).to.eq(400)
                expect(xhr.body.errors).to.include("Gender selection is required.")
            })
        })
        it('Should check user create with registrated email', () => {
            UserManagementBuilders.PostUser(registratedEmailUser).then(xhr => {
                expect(xhr.status).to.eq(409)
                expect(xhr.body.errors[0]).to.include("Email already exists.")
            })
        })
        it('Should check delete admin user without login', () => {
            UserManagementBuilders.DeleteUser(1).then(xhr => {
                expect(xhr.status).to.eq(403)
            })
            UserManagementBuilders.GetUsers().then(xhr => {
                expect(xhr.body).to.be.an('array').and.have.length(3)
            })
        })
    })
    context.only("User positives", () => {
        const correctUser: NewUser = {name: "TestUser", age: "18", role: "Editor", email: "qwerty@mail.ru", gender: "Male", subscribtion: "Newsletter"}
        it('Should successfully create user', () => {
            UserManagementBuilders.ResetData()
            UserManagementBuilders.GetUsers().then(xhr => {
                    expect(xhr.body).to.be.an('array').and.have.length(3)
                })
            UserManagementBuilders.PostUser(correctUser).then(xhr => {
                expect(xhr.status).to.eq(200)
                UserManagementBuilders.GetUsers().then(xhr => {
                    expect(xhr.body).to.be.an('array').and.have.length(4)
                })    
            })
        })
        it('Should edit user', () => {
            UserManagementBuilders.UpdateUser(1, {name: "Rob", age: "55", role: "Admin", email: "testemail@123.45", gender: "Other"}).then(xhr => {
                expect(xhr.status).to.eq(200)
            })
            UserManagementBuilders.GetUsers().then(xhr => {
                const firstUser = xhr.body[0]
                expect(firstUser.name).to.eq('Rob')
                expect(firstUser.age).to.eq('55')
                expect(firstUser.role).to.eq('Admin')
                expect(firstUser.email).to.eq('testemail@123.45')
                expect(firstUser.gender).to.eq('Other')
            })
        })
        it('Should change user status', () => {
            UserManagementBuilders.ChangeStatus(1, 'Inactive').then(xhr => {
                expect(xhr.body.status).to.eq('Inactive')
            })
        })
        it('Should delete user without admin role', () => {
            UserManagementBuilders.DeleteUser(2).then(xhr => {
                expect(xhr.status).to.eq(200)
                expect(xhr.body).deep.equal({success: true})
            })
            UserManagementBuilders.GetUsers().then(xhr => {
                expect(xhr.body).to.be.an('array').and.have.length(2)
            })
        })
    })
})