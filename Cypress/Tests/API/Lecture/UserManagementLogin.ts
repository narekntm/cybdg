import { UserManagementBuilders } from "Builders/UserManagementBuilders"
import { UserManagementEndpoints } from "EndPoints/user_managementEndpoints";

describe ("User Management API", () => {
    const baseUrl = "/";

  beforeEach(() => {
    cy.intercept("GET", UserManagementEndpoints.Users()).as("getusers")
    cy.visit(baseUrl);
  });

    
  describe("🔐 Admin Login", () => {
    it ("Admin positive case: successful login", () => {
      UserManagementBuilders.AdminLogin("admin@example.com" , "admin123").then( (xhr) => {
         expect(xhr.status).to.eq(200)
         expect(xhr.body).to.have.property("success", true)
  })
})


  it ("Admin negative case: user wrong, password wrong", () => {
      UserManagementBuilders.AdminLogin("wrongemail" , "wrongpass").then( xhr => {
          expect(xhr.status).to.eq(401)
          expect(xhr.body).to.have.property("success", false)
  })
})


it ("Admin negative case: user wrong", () => {
  UserManagementBuilders.AdminLogin("wrongemail" , "admin123").then( xhr => {
      expect(xhr.status).to.eq(401)
      expect(xhr.body).to.have.property("success", false)
})
})


it ("Admin negative case: password wrong", () => {
  UserManagementBuilders.AdminLogin("admin@example.com" , "wrongpass").then( xhr => {
      expect(xhr.status).to.eq(401)
      expect(xhr.body).to.have.property("success", false)
})
})

it ("Admin negative case: empty fields", () => {
  UserManagementBuilders.AdminLogin("" , "").then( xhr => {
      expect(xhr.status).to.eq(401)
      expect(xhr.body).to.have.property("success", false)
})
})

  })
   
})