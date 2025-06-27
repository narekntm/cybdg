import { UserManagementBuilders } from "Builders/UserManagementBuilders";
import { UserManagementEndpoints } from "EndPoints/user_managementEndpoints";
import { UserManagementPage } from "Pages/UserManagementPage";


describe ("User Management API", () => {
    const baseUrl = "/";

  beforeEach(() => {
   
    cy.visit(baseUrl);
  });

    
  describe("👤 Add/Edit/Delete User Form", () => {
    it ("Delete Admin user (logged in)", () => {
        UserManagementBuilders.AdminLogin("admin@example.com", "admin123").then(xhr => {
            expect(xhr.status).to.eq(200);
            expect(xhr.status).deep.equal({success: true})
        })
        UserManagementBuilders.GetUsers().then((xhr) => {
            expect(xhr.body.length).to.eq(3);
            expect(xhr.status).deep.equal({success: true})
          });

        UserManagementBuilders.DeleteUserAsAdmin(1).then(xhr => {
            expect(xhr.status).to.eq(200)
            expect(xhr.status).deep.equal({success: true})
        })
    })

        it ("Delete Admin user (logged out)", () => {
            UserManagementBuilders.GetUsers().then((xhr) => {
                expect(xhr.body.length).to.eq(3);
                
              });
    
            UserManagementBuilders.DeleteUserAsAdmin(1).then(xhr => {
                expect(xhr.status).to.eq(401)
            })


        


            it("Edit user and verify updated values", () => {
                UserManagementBuilders.EditUser(2).then( xhr => {
                    expect(xhr.status).to.eq(200)
                })
            })
            

            it("Toggles status between Active and Inactive", () => {
                UserManagementBuilders.UserStatusEdit(2).then( (xhr) => {
                    expect(xhr.status).to.eq(200)
                })
            })

    })





       
  })
   
})




 //    UserManagementBuilders.CreateUser({
    //     name: "John",
    //     role: "Editor",
    //     age: 30,
    //     email: "john@example.com",
    //     gender: "Male",
    //     subscriptions: ["Newsletter"],
    //   }).then((xhr) => {
    //     expect(xhr.status).to.eq(200);
    //   })
    //   UserManagementBuilders.GetUsers().then((xhr) => {
    //     expect(xhr.body.length).to.eq(4);
    //   });