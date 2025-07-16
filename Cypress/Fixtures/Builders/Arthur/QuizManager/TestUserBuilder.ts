import { UserCredentials, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { UserGenerator } from "Generators/Arthur/QuizManager/UserGenerator";

export class TestUserBuilder {
    static getToken(): Cypress.Chainable<string> {
        return cy.request("POST", QuizManagerEndpoints.testAuth, {
            email: UserGenerator.testManagerCredentials.email,
            password: UserGenerator.testManagerCredentials.password,
        }).then((res) => res.body.token);
    }

    static createUser(role: UserRole, overrides = {}): Cypress.Chainable<UserCredentials> {
        const user = UserGenerator.generateUser(role);

        return this.getToken().then((token) => {
            return cy.request({
                method: "POST",
                url: QuizManagerEndpoints.testUsers,
                headers: { Authorization: `Bearer ${token}` },
                body: { ...user, ...overrides },
            }).then(() => ({ ...user, ...overrides }));
        });
    }
}
