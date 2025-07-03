import { UserManagementEndPoints } from "Cypress/Fixtures/EndPoints/UserManagementEndPoints";
import { UserManagementModels } from "Cypress/Fixtures/Models/UserManagementModels";
import { UserManagementPage } from "Cypress/Fixtures/UserManagementPage";

describe("User Management Suite", () => {
  let loginPositiveCase: UserManagementModels.Login;
  let loginNegativeCase: UserManagementModels.Login;
  let userFormPositiveCase: UserManagementModels.User;

  function adminLogin(login: UserManagementModels.Login) {
    if (login.email !== "") {
      UserManagementPage.adminTitle().should("have.text", "Login as Admin");
      UserManagementPage.adminEmailLbl().should("have.text", "Email");
      UserManagementPage.adminEmailInput().should("have.attr", "required");
      UserManagementPage.adminEmailInput().should("be.visible").and("be.enabled").clear();
      UserManagementPage.adminEmailInput().type(login.email);
    }

    if (login.password !== "") {
      UserManagementPage.adminPasswordLbl().should("have.text", "Password");
      UserManagementPage.adminPasswordInput().should("have.attr", "required");
      UserManagementPage.adminPasswordInput().should("be.visible").and("be.enabled").clear();
      UserManagementPage.adminPasswordInput().type(login.password);
    }

    UserManagementPage.adminSubmitBtn().should("have.text", "Login").click();
  }

  function fillUserForm(user: UserManagementModels.User) {
    if (user.name) {
      UserManagementPage.formNewUserTitle().should("have.text", "Add New User");
      UserManagementPage.fullNameLbl().should("have.text", "Full Name");
      UserManagementPage.fullNameInput().should("have.attr", "required");
      UserManagementPage.fullNameInput().should("be.visible").and("be.enabled").clear();
      UserManagementPage.fullNameInput().type(user.name);
    }

    if (user.role) {
      UserManagementPage.roleLbl().should("have.text", "Role");
      UserManagementPage.roleSelect().should("have.attr", "required");
      UserManagementPage.roleSelect().should("be.visible").and("be.enabled").select("Select");
      UserManagementPage.roleSelect().select(user.role);
    }

    if (user.age) {
      UserManagementPage.ageLbl().should("have.text", "Age");
      UserManagementPage.ageInput().should("be.visible").and("be.enabled").clear();
      UserManagementPage.ageInput().type(user.age.toString());
    }

    if (user.email) {
      UserManagementPage.emailLbl().should("have.text", "Email");
      UserManagementPage.emailInput().should("have.attr", "required");
      UserManagementPage.emailInput().should("be.visible").and("be.enabled").clear();
      UserManagementPage.emailInput().type(user.email);
    }

    if (user.gender) {
      UserManagementPage.genderTitle().should("have.text", "Gender");
      UserManagementPage.genderInput(user.gender).check();
    }

    UserManagementPage.subscribeTitle().should("have.text", "Subscribe to");
    user.subscriptions.forEach((value) => {
      UserManagementPage.subscriptionInput(value).check();
    });

    UserManagementPage.userFormSubmitBtn().should("have.text", "Save");
  }

  const baseURL = "/";

  before(() => {
    cy.fixture("userData").then((data) => {
      loginPositiveCase = data.loginPositiveCase;
      loginNegativeCase = data.loginNegativeCase;
      userFormPositiveCase = data.userFormPositiveCase;
    });
  });

  beforeEach(() => {
    cy.visit(baseURL);

    cy.intercept({ method: "POST", url: UserManagementEndPoints.adminLogin }).as("postAdmin");
    cy.intercept({ method: "POST", url: UserManagementEndPoints.users() }).as("postUser");
    cy.intercept({ method: "DELETE", url: UserManagementEndPoints.users(1) }).as("deleteUser");
    cy.intercept({ method: "PUT", url: UserManagementEndPoints.users(1) }).as("putUser");
    cy.intercept({ method: "PATCH", url: UserManagementEndPoints.status(1) }).as("patchUser");
    cy.intercept({ method: "POST", url: UserManagementEndPoints.reset }).as("resetData");
  });

  afterEach(() => {
    cy.request({ method: "POST", url: UserManagementEndPoints.reset });
  });

  context("Admin Login Suite", () => {
    it("Login as Admin, Positive case", () => {
      adminLogin(loginPositiveCase);

      cy.wait("@postAdmin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.equal({ success: true });
      });

      UserManagementPage.adminEmailInput().should("have.value", "");
      UserManagementPage.adminPasswordInput().should("have.value", "");
      UserManagementPage.loggedStrong().should("have.text", "You are logged in as admin.");
      UserManagementPage.logoutBtn().should("have.text", "Logout").should("be.visible");
    });

    it("Login as Admin, Negative case", () => {
      adminLogin(loginNegativeCase);

      cy.wait("@postAdmin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(401);
        expect(xhr.response.statusMessage).to.eq("Unauthorized");
        expect(xhr.response.body).deep.equal({ success: false });
      });

      UserManagementPage.loginStatus().should("be.visible").and("have.text", "Invalid credentials");
    });

    it("Logout Admin", () => {
      adminLogin(loginPositiveCase);
      UserManagementPage.logoutBtn().click();
      UserManagementPage.adminControls().should("not.be.visible");
    });

    it("Delete admin after login", () => {
      adminLogin(loginPositiveCase);
      UserManagementPage.userTableRowAdminDeleteButton().click();
      UserManagementPage.confirmModal().should("be.visible");
    });

    it("Delete admin without login", () => {
      UserManagementPage.userTableRowAdminDeleteButton().click();
      UserManagementPage.adminError().should("be.visible").and("have.text", "Admin login required to delete Admin-level users.");
    });
  });

  context("User Management Adding Suite", () => {
    it("Add a user, Positive case", () => {
      fillUserForm(userFormPositiveCase);
      UserManagementPage.userTableRows()
        .its("length")
        .then((count: number) => {
          UserManagementPage.userFormSubmitBtn().click();

          cy.wait("@postUser").then((xhr) => {
            console.log("xhr", xhr);
            expect(xhr.response.statusCode).to.be.equal(200);
            expect(xhr.response.statusMessage).to.eq("OK");
          });

          UserManagementPage.userTableRows().its("length").should("be.gt", count);
        });
    });

    it("Add an empty user", () => {
      UserManagementPage.userFormSubmitBtn().click();
      UserManagementPage.userFormErrors().should("be.visible");
    });

    it("Add user with wrong name format", () => {
      UserManagementPage.fullNameInput().clear().type("Wrong Name");
      UserManagementPage.userFormSubmitBtn().click();
      UserManagementPage.nameError().should("be.visible");
    });

    it("Add user with no role selecting", () => {
      UserManagementPage.roleSelect().select("Select");
      UserManagementPage.userFormSubmitBtn().click();
      UserManagementPage.roleError().should("be.visible");
    });

    it("Add user with wrong age format", () => {
      UserManagementPage.ageInput().clear().type("300");
      UserManagementPage.userFormSubmitBtn().click();
      UserManagementPage.ageError().should("be.visible");
    });

    it("Add user with no gender checked", () => {
      UserManagementPage.fullNameInput().clear().type("LarisaYeremyan");
      UserManagementPage.userFormSubmitBtn().click();
      UserManagementPage.genderError().should("be.visible");
    });
  });

  context("User Table Suite", () => {
    it("User Table Test", () => {
      UserManagementPage.userTableRows().should("have.length", 3);
      UserManagementPage.userTableColumnCount().should("have.length", 8);

      UserManagementPage.userTableHeader().each(($el: JQuery<HTMLElement>, index: number) => {
        UserManagementPage.userTableHeaderTd($el).should(
          "have.text",
          UserManagementModels.ColumnNames[UserManagementModels.Columns[index] as keyof typeof UserManagementModels.ColumnNames]
        );
      });
    });
  });

  context("User Management Editing/Deleting Suite", () => {
    it("User table first row edit", () => {
      UserManagementPage.userTableRowTds(0).then((cells: JQuery<HTMLElement>) => {
        const user: UserManagementModels.User = {
          name: cells[UserManagementModels.Columns.Name].innerText,
          role: cells.eq(UserManagementModels.Columns.Role).text() as UserManagementModels.UserRole,
          age: Number(cells[UserManagementModels.Columns.Age].innerText),
          email: cells[UserManagementModels.Columns.Email].innerText,
          gender: cells.eq(UserManagementModels.Columns.Gender).text() as UserManagementModels.Gender,
          subscriptions: cells[UserManagementModels.Columns.Subscription].innerText.split(",") as UserManagementModels.Subscription[],
        };

        UserManagementPage.userTableRowEditButton(0)
          .should("have.text", UserManagementModels.ActionButtons.Edit)
          .should("be.visible")
          .click();

        UserManagementPage.fullNameInput().should("have.value", user.name);
        UserManagementPage.roleSelect().should("have.value", user.role);
        UserManagementPage.ageInput().should("have.value", user.age);
        UserManagementPage.emailInput().should("have.value", user.email);
        UserManagementPage.genderInput(user.gender).should("be.checked");

        user.subscriptions.forEach((value: string) => {
          UserManagementPage.subscriptionInput(value).should("be.checked");
        });

        UserManagementPage.fullNameInput().clear().type("NewName");
        UserManagementPage.ageInput().clear().type("23");

        UserManagementPage.userFormSubmitBtn().click();

        cy.wait("@putUser").then((xhr) => {
          expect(xhr.response.statusCode).to.be.equal(200);
        });

        UserManagementPage.userTableRowTds(0).eq(UserManagementModels.Columns.Name).should("have.text", "NewName");
      });
    });

    it("User table first row delete and cancel", () => {
      adminLogin(loginPositiveCase);

      UserManagementPage.userTableRowDeleteButton(0).click();
      UserManagementPage.confirmModal().should("be.visible");
      UserManagementPage.deleteModalTitle().contains("Are you sure you want to delete this user?");
      UserManagementPage.deleteModalConfirmBtn().should("be.visible");
      UserManagementPage.deleteModalCancelBtn().should("be.visible").click();
    });

    it("User table first row delete and confirm", () => {
      adminLogin(loginPositiveCase);

      UserManagementPage.userTableRowDeleteButton(0).click();
      UserManagementPage.confirmModal().should("be.visible");
      UserManagementPage.deleteModalTitle().contains("Are you sure you want to delete this user?");

      let userTableRowCount: number;
      UserManagementPage.userTableRows()
        .its("length")
        .then((count: number) => {
          userTableRowCount = count;
          UserManagementPage.deleteModalConfirmBtn().should("be.visible").click();

          cy.wait("@deleteUser").then((xhr) => {
            expect(xhr.response.statusCode).to.eq(200);
            expect(xhr.response.body).deep.equal({ success: true });
          });

          UserManagementPage.userTableRows().its("length").should("be.lt", userTableRowCount);
        });
    });

    context("User Management Status Toggle Suite", () => {
      it("User table first row toggle activate", () => {
        UserManagementPage.userTableRowStatusButton(0).as("submitBtn");

        cy.get("@submitBtn")
          .should("be.visible")
          .invoke("text")
          .then(() => {
            cy.get("@submitBtn").should("have.text", UserManagementModels.ButtonAction.Deactivate);
            cy.get("@submitBtn").click();

            cy.wait("@patchUser").then((xhr) => {
              expect(xhr.response.statusCode).to.eq(200);
              expect(xhr.response.statusMessage).to.eq("OK");
            });

            cy.get("@submitBtn").should("have.text", UserManagementModels.ButtonAction.Activate);
          });
      });
    });

    context("Reset data Suite", () => {
      it("Reset data test", () => {
        UserManagementPage.resetBtn().click();
        UserManagementPage.resetModalCancelBtn().should("be.visible");
        UserManagementPage.resetModalConfirmBtn().should("be.visible").click();

        cy.wait("@resetData").then((xhr) => {
          expect(xhr.response.statusCode).to.eq(200);
          expect(xhr.response.body.users).to.be.an("array").with.length(3);
        });
      });
    });
  });
});