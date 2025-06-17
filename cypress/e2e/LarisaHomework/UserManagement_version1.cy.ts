import { UserManagementPage } from "../../fixtures/UserManagementPage";

describe("User Management Suite", () => {
  let tableHeaders: string[] = [];
  let loginPositiveCase: {
    email: string;
    password: string;
  };

  type Login = {
    email: string;
    password: string;
  };
  let loginNegativeCases: Login[] = [];

  let userFormPositiveData: {
    name: string;
    role: string;
    age: number;
    email: string;
    gender: string;
    subscription: string;
  };

  type User = {
    name: string;
    role: string;
    age: number;
    email: string;
    gender: string;
    subscription: string;
  };
  let userFormNegativeData: User[] = [];

  before(() => {
    cy.fixture("userData").then((data) => {
      tableHeaders = data.tableHeaders;
      loginPositiveCase = data.loginPositiveCase;
      loginNegativeCases = data.loginNegativeCases;
      userFormPositiveData = data.userFormPositiveData;
      userFormNegativeData = data.userFormNegativeData;
    });
  });

  beforeEach(() => {
    cy.log("Test is starting");
    cy.visit("http://127.0.0.1:5500/resources/htmls/css/user_management.html");
  });

  it("Login as Admin, Positive case", () => {
    UserManagementPage.adminTitle().should("have.text", "Login as Admin");

    UserManagementPage.adminEmailLbl().should("have.text", "Email");
    UserManagementPage.adminEmailInput().should("have.attr", "required");
    UserManagementPage.adminEmailInput().should("be.visible").and("be.enabled").clear();

    if (loginPositiveCase.email !== undefined && loginPositiveCase.email !== "") {
      UserManagementPage.adminEmailInput().type(loginPositiveCase.email);
    }

    UserManagementPage.adminPasswordLbl().should("have.text", "Password");
    UserManagementPage.adminPasswordInput().should("have.attr", "required");
    UserManagementPage.adminPasswordInput().should("be.visible").and("be.enabled").clear();

    if (loginPositiveCase.password !== undefined && loginPositiveCase.password !== "") {
      UserManagementPage.adminPasswordInput().type(loginPositiveCase.password);
    }

    UserManagementPage.adminSubmitBtn().should("have.text", "Save");
    UserManagementPage.adminSubmitBtn()
      .click()
      .then(() => {
        UserManagementPage.loggedStrog().should("have.text", "You are logged in as admin.");
        //UserManagementPage.logoutBtn().should('have.text', 'Logout').click();
      });
  });

  it("Login as Admin, Negative case", () => {
    loginNegativeCases.forEach(({ email, password }) => {
      UserManagementPage.adminEmailInput().clear();
      if (email !== undefined && email !== "") {
        UserManagementPage.adminEmailInput().type(email);
      }

      UserManagementPage.adminPasswordInput().clear();
      if (password !== undefined && password !== "") {
        UserManagementPage.adminPasswordInput().type(password);
      }

      UserManagementPage.adminSubmitBtn()
        .click()
        .then(() => {
          UserManagementPage.loginStatus().should("have.text", "Invalid credentials");
        });
    });
  });

  it("User Management Test, Positive case", () => {
    UserManagementPage.formNewUserTitle().should("have.text", "Add New User");
    UserManagementPage.firstNameLbl().should("have.text", "Full Name");
    UserManagementPage.firstNameInput().should("have.attr", "required");
    UserManagementPage.firstNameInput().should("be.visible").and("be.enabled").clear();

    if (userFormPositiveData.name !== undefined && userFormPositiveData.name !== "") {
      UserManagementPage.firstNameInput().type(userFormPositiveData.name);
    }

    UserManagementPage.roleLbl().should("have.text", "Role");
    UserManagementPage.roleSelect().should("have.attr", "required");
    UserManagementPage.roleSelect().should("be.visible").and("be.enabled");

    if (userFormPositiveData.role !== undefined && userFormPositiveData.role !== "") {
      UserManagementPage.roleSelect().select(userFormPositiveData.role);
    }

    UserManagementPage.ageLbl().should("have.text", "Age");
    UserManagementPage.ageInput().should("be.visible").and("be.enabled").clear();

    if (userFormPositiveData.age !== undefined && userFormPositiveData.age !== 0) {
      UserManagementPage.ageInput().type(userFormPositiveData.age.toString());
    }

    UserManagementPage.emailLbl().should("have.text", "Email");
    UserManagementPage.emailInput().should("have.attr", "required");
    UserManagementPage.emailInput().should("be.visible").and("be.enabled").clear();

    if (userFormPositiveData.email !== undefined && userFormPositiveData.email !== "") {
      UserManagementPage.emailInput().type(userFormPositiveData.email);
    }

    UserManagementPage.genderTitle().should("have.text", "Gender");
    if (userFormPositiveData.gender !== undefined && userFormPositiveData.gender !== "") {
      cy.get(`input[value="${userFormPositiveData.gender}"]`).check();
    }

    UserManagementPage.subscribeTitle().should("have.text", "Subscribe to");
    if (userFormPositiveData.subscription !== undefined && userFormPositiveData.subscription !== "") {
      cy.get(`input[value="${userFormPositiveData.subscription}"]`).check();
    }

    UserManagementPage.userFormSubmitBtn().should("have.text", "Save");

    UserManagementPage.userTableRows()
      .its("length")
      .then((count: number) => {
        UserManagementPage.userFormSubmitBtn()
          .click()
          .then(() => {
            UserManagementPage.userTableRows().its("length").should("be.gt", count);
          });
      });
  });

  it("User Management Test, Negative case", () => {
    userFormNegativeData.forEach(({ name, role, age, email, gender, subscription }) => {
      UserManagementPage.firstNameInput().clear();
      if (name !== undefined && name !== "") {
        UserManagementPage.firstNameInput().type(name);
      }

      UserManagementPage.roleSelect().should("have.attr", "required");
      UserManagementPage.roleSelect().select("Select");
      if (role !== undefined && role !== "") {
        UserManagementPage.roleSelect().type(role);
      }

      UserManagementPage.ageLbl().should("have.text", "Age");
      UserManagementPage.ageInput().should("be.visible").and("be.enabled").clear();
      if (age !== undefined && age !== 0) {
        UserManagementPage.ageInput().type(`${age}`);
      }

      UserManagementPage.emailLbl().should("have.text", "Email");
      UserManagementPage.emailInput().should("have.attr", "required");
      UserManagementPage.emailInput().should("be.visible").and("be.enabled").clear();
      if (email !== undefined && email !== "") {
        UserManagementPage.emailInput().type(email);
      }

      UserManagementPage.genderTitle().should("have.text", "Gender");
      if (gender !== undefined && gender !== "") {
        cy.get(`input[value="${gender}"]`).check();
      }

      UserManagementPage.subscribeTitle().should("have.text", "Subscribe to");
      if (subscription !== undefined && subscription !== "") {
        cy.get(`input[value="${subscription}"]`).check();
      }

      UserManagementPage.userFormSubmitBtn().should("have.text", "Save");

      UserManagementPage.userTableRows()
        .its("length")
        .then((count: number) => {
          UserManagementPage.userFormSubmitBtn()
            .click()
            .then(() => {
              cy.get("table#user-table tbody tr").its("length").should("be.eq", count);

              UserManagementPage.userFormErrors().should("be.visible");
            });
        });
    });
  });

  it("User Table", () => {
    UserManagementPage.userTableRows().should("have.length", 3);

    UserManagementPage.userTableColumnCount().should("have.length", 8);

    UserManagementPage.userTableHeader().each(($el: JQuery<HTMLElement>, index: number) => {
      cy.wrap($el).should("have.text", tableHeaders[index]);
    });
  });

  it("User table random row edit", () => {
    UserManagementPage.userTableRow().then((rows: JQuery<HTMLElement>) => {
      const rowCount: number = rows.length;
      const randomIndex = Math.floor(Math.random() * rowCount);

      cy.wrap(rows)
        .eq(randomIndex)
        .then((randomRow: JQuery<HTMLElement>) => {
          const user: any = {};
          let colIndex = 0;

          cy.wrap(randomRow)
            .find("td")
            .each(($el) => {
              const columnName = tableHeaders[colIndex];
              user[columnName] = $el.text();
              colIndex++;
            })
            .then(() => {
              user.Subscription = user.Subscription.split(",").map((v: string) => v.trim());

              cy.wrap(randomRow)
                .find("button.edit-btn")
                .should("have.text", "Edit")
                .should("be.visible")
                .click()
                .then(() => {
                  UserManagementPage.firstNameInput().should("have.value", user.Name);
                  UserManagementPage.roleSelect().should("have.value", user.Role);
                  UserManagementPage.ageInput().should("have.value", user.Age);
                  UserManagementPage.emailInput().should("have.value", user.Email);
                  cy.get(`input[value="${user.Gender}"]`).should("be.checked");

                  user.Subscription.forEach((value: string) => {
                    cy.get(`input[value="${value}"]`).should("be.checked");
                  });
                });
            });
        });
    });
  });

  it("User table random row toggle activate", () => {
    UserManagementPage.userTableRows().then((rows: JQuery<HTMLElement>) => {
      const rowCount = rows.length;
      const randomIndex = Math.floor(Math.random() * rowCount);

      cy.wrap(rows)
        .eq(randomIndex)
        .then((randomRow) => {
          let status: string;
          cy.wrap(randomRow)
            .find("td")
            .find("button.status-btn")
            .invoke("text")
            .then((text) => {
              status = text;
            });

          cy.wrap(randomRow)
            .find("td")
            .find("button.status-btn")
            .should("be.visible")
            .click()
            .then(() => {
              if (status === "Activate") {
                cy.wrap(randomRow).find("td").find("button.status-btn").should("have.text", "Deactivate");
              } else {
                cy.wrap(randomRow).find("td").find("button.status-btn").should("have.text", "Activate");
              }
            });
        });
    });
  });

  it("User table admin row delete", () => {
    const roleToFind = "Admin";

    UserManagementPage.userTableHeader().then(() => {
      const roleColIndex = tableHeaders.indexOf("Role");

      UserManagementPage.userTableRows().each(($row: JQuery<HTMLElement>) => {
        cy.wrap($row)
          .find("td")
          .eq(roleColIndex)
          .then(($cell) => {
            if ($cell.text().trim() === roleToFind) {
              cy.wrap($row)
                .find("td")
                .find("button.delete-btn")
                .should("have.text", "Delete")
                .should("be.visible")
                .click()
                .then(() => {
                  UserManagementPage.adminError().should("have.text", "Admin login required to delete Admin-level users.");
                });
            }
          });
      });
    });
  });

  it("User table random row not admin delete and cancel", () => {
    const roleToFind = "Admin";

    UserManagementPage.userTableHeader().then(() => {
      const roleColIndex = tableHeaders.indexOf("Role");

      UserManagementPage.userTableRows().each(($row: JQuery<HTMLElement>) => {
        cy.wrap($row)
          .find("td")
          .eq(roleColIndex)
          .then(($cell) => {
            if ($cell.text().trim() !== roleToFind) {
              cy.wrap($row)
                .find("td")
                .find("button.delete-btn")
                .should("have.text", "Delete")
                .should("be.visible")
                .click()
                .then(() => {
                  UserManagementPage.deleteModalTitle().contains("Are you sure you want to delete this user?");
                  UserManagementPage.deleteModalConfirmBtn().should("be.visible");
                  UserManagementPage.deleteModalCancelBtn()
                    .should("be.visible")
                    .click()
                    .then(() => {
                      UserManagementPage.confirmModal().should("not.be.visible");
                    });
                });
            }
          });
      });
    });
  });

  it("User table random row not admin delete and confirm", () => {
    const roleToFind = "Admin";

    UserManagementPage.userTableHeader().then(() => {
      const roleColIndex = tableHeaders.indexOf("Role");

      UserManagementPage.userTableRows().each(($row: JQuery<HTMLElement>) => {
        cy.wrap($row)
          .find("td")
          .eq(roleColIndex)
          .then(($cell) => {
            if ($cell.text().trim() !== roleToFind) {
              cy.wrap($row)
                .find("td")
                .find("button.delete-btn")
                .should("have.text", "Delete")
                .should("be.visible")
                .click()
                .then(() => {
                  UserManagementPage.deleteModalTitle().contains("Are you sure you want to delete this user?");
                  UserManagementPage.deleteModalCancelBtn().should("be.visible");

                  UserManagementPage.userTableRows()
                    .its("length")
                    .then((count: number) => {
                      UserManagementPage.deleteModalConfirmBtn()
                        .should("be.visible")
                        .click()
                        .then(() => {
                          UserManagementPage.confirmModal().should("not.be.visible");

                          cy.get("table#user-table tbody tr").its("length").should("be.lt", count);
                        });
                    });
                });
            }
          });
      });
    });
  });
});
