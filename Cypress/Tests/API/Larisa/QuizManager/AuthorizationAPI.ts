import { QuizzManagementBuilders } from "Builders/Larisa/QuizManager/QuizzManagementBuilders";
import { adminLogin, createUsers, userLogin } from "Cypress/Support/Larisa/QuizzHelper";

describe("QuizzManagement Suite", () => {
  before(() => {
    QuizzManagementBuilders.auth().then(createUsers);
  });

  it("Login as Admin", () => {
    QuizzManagementBuilders.loginUser(adminLogin).then((responce) => {
      expect(responce.status).to.eq(200);
      expect(responce.statusText).to.eq("OK");
    });
  });

  it("Login as User", () => {
    QuizzManagementBuilders.loginUser(userLogin).then((responce) => {
      expect(responce.status).to.eq(200);
      expect(responce.statusText).to.eq("OK");
    });
  });

  it("Logout user", () => {
    QuizzManagementBuilders.loginUser(adminLogin);
    QuizzManagementBuilders.logout().then((responce) => {
      expect(responce.status).to.eq(200);
      expect(responce.statusText).to.eq("OK");
    });
  });
});
