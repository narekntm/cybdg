import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { generateUser } from "Helpers/anahit-tadevosyan/QuizManager/QuizManagerHelpers";
import { Role } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

Cypress.Commands.add("setupQuizManagerTestData", function () {
  const managerUser = generateUser(Role.Manager);
  const regularUser1 = generateUser(Role.User);
  const regularUser2 = generateUser(Role.User);

  return QuizManagerBuilders.Auth().then(() => {
    return Promise.all([
      QuizManagerBuilders.User(managerUser),
      QuizManagerBuilders.User(regularUser1),
      QuizManagerBuilders.User(regularUser2),
    ]).then(() => {
      cy.wrap(managerUser).as("managerUser");
      cy.wrap(regularUser1).as("regularUser1");
      cy.wrap(regularUser2).as("regularUser2");
    });
  });
});
