// import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
// import { generateUser } from "Helpers/anahit-tadevosyan/QuizManager/QuizManagerHelpers";
// import { Role, User } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";
//
// export let managerUser: User;
// export let regularUser1: User;
// export let regularUser2: User;
//
// export function setupTestUsers(): Cypress.Chainable<void> {
//   return QuizManagerBuilders.Auth().then(() => {
//     managerUser = generateUser(Role.Manager);
//     regularUser1 = generateUser(Role.User);
//     regularUser2 = generateUser(Role.User);
//
//     return cy.then(() => {
//       console.log("Creating users now...");
//       return Promise.all([
//         QuizManagerBuilders.User(managerUser),
//         QuizManagerBuilders.User(regularUser1),
//         QuizManagerBuilders.User(regularUser2),
//       ]).then(() => {
//         console.log("Users created!:", managerUser.email, managerUser.password);
//       });
//     });
//   });
// }
