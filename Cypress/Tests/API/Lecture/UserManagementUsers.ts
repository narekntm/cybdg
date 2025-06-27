import { UserManagementBuilders } from "Builders/UserManagementBuilders";
import { NewUser } from "Pages/Models/UserManagementModels";


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
        it('Should check user create without name', () => {
            UserManagementBuilders.PostUser(withoutName).then(xhr => {
                expect(xhr.status).to.eq(400)
                expect(xhr.body).to.have.property('error', 'Missing fields')
            })
        })
        it('Should check user create without age', () => {
            UserManagementBuilders.PostUser(withoutAge).then(xhr => {
                expect(xhr.status).to.eq(400)
                expect(xhr.body).to.have.property('error', 'Missing fields')
            })
        })
        it('Should check user create without role', () => {
            UserManagementBuilders.PostUser(withoutRole).then(xhr => {
                expect(xhr.status).to.eq(400)
                expect(xhr.body).to.have.property('error', 'Missing fields')
            })
        })
        it('Should check user create without email', () => {
            UserManagementBuilders.PostUser(withoutEmail).then(xhr => {
                expect(xhr.status).to.eq(400)
                expect(xhr.body).to.have.property('error', 'Missing fields')
            })
        })
        it('Should check user create without gender', () => {
            UserManagementBuilders.PostUser(withoutGender).then(xhr => {
                expect(xhr.status).to.eq(400)
                expect(xhr.body).to.have.property('error', 'Missing fields')
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
    context("User positives", () => {
        const correctUser: NewUser = {name: "Test User", age: "18", role: "Editor", email: "qwerty@mail.ru", gender: "Male", subscribtion: "Newsletter"}
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