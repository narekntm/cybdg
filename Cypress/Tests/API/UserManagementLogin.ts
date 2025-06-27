describe('Admin negative cases', () => {
    it("Should check admin login with invalid credentials", () => {
        UserManagementBuilders.AdminLogin("test@mail.ru", "test1234").then(xhr => {
          expect(xhr.status).to.eq(401)
        })
      })
    it("Should check admin login with empty fields", () => {
        UserManagementBuilders.AdminLogin("  ", "  ").then(xhr => {
          expect(xhr.status).to.eq(401)
        })
    })
  }