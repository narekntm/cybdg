import { UserBuilder } from "Builders/Arthur/QuizManager/QuizManagerBuilders";
import {
    loginViaApi,
    logoutViaApi,
    clearAuth,
} from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { UserFields, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";
import { AuthErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";

describe("Auth API Tests", () => {
    const authMe = QuizManagerEndpoints.authMe;

    context("Positive login scenarios", () => {

        it("Should login as Admin and access /auth/me", () => {
            const user = UserBuilder.validAdmin();

            loginViaApi(user).then(() => {
                cy.request(authMe).then((res) => {
                    expect(res.status).to.eq(200);
                    expect(res.body.email).to.eq(user.email);
                    expect(res.body.role).to.eq(UserRole.Admin);
                });
            });
        });

        it("Should login as User and access /auth/me", () => {
            const user = UserBuilder.validUser();

            loginViaApi(user).then(() => {
                cy.request(authMe).then((res) => {
                    expect(res.status).to.eq(200);
                    expect(res.body.email).to.eq(user.email);
                    expect(res.body.role).to.eq(UserRole.User);
                });
            });
        });

        it("Should logout and block access to /auth/me", () => {
            const user = UserBuilder.validUser();

            loginViaApi(user).then(() => {
                logoutViaApi().then(() => {
                    cy.request({
                        method: "GET",
                        url: QuizManagerEndpoints.authMe,
                        failOnStatusCode: false,
                    }).then((res) => {
                        expect(res.status).to.eq(401);
                        expect(res.body.error).to.eq(AuthErrorMessages.Unauthorized);
                    });
                });
            });
        });

        it("Should allow Admin to access /api/users", () => {
            const admin = UserBuilder.validAdmin();

            loginViaApi(admin).then(() => {
                cy.request(QuizManagerEndpoints.users).then((res) => {
                    expect(res.status).to.eq(200);
                    expect(res.body).to.be.an("array");
                    res.body.forEach((user: any) => {
                        expect(user).to.have.all.keys(UserFields.Id, UserFields.Email, UserFields.Role);
                        expect(user.role).to.eq(UserRole.User);
                    });
                });
            });
        });


    });

    context("Negative login scenarios", () => {
        beforeEach(() => {
            clearAuth();
        });

        it("Should not login with invalid email", () => {
            const user = UserBuilder.invalidUser();

            UserBuilder.LoginRequest(user, false).then((res) => {
                expect(res.status).to.eq(401);
                expect(res.body.error).to.eq(AuthErrorMessages.InvalidCredentials);
            });
        });

        it("Should not login with wrong password", () => {
            const user = UserBuilder.withWrongPassword();

            UserBuilder.LoginRequest(user, false).then((res) => {
                expect(res.status).to.eq(401);
                expect(res.body.error).to.eq(AuthErrorMessages.InvalidCredentials);
            });
        });

        it("Should block access to /auth/me without login", () => {
            cy.request({
                method: "GET",
                url: authMe,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.eq(401);
                expect(res.body.error).to.eq(AuthErrorMessages.Unauthorized);
            });
        });

        it("Should not allow user to access /api/users (admin only)", () => {
            const user = UserBuilder.validUser();

            loginViaApi(user).then(() => {
                cy.request({
                    method: "GET",
                    url: QuizManagerEndpoints.users,
                    failOnStatusCode: false,
                }).then((res) => {
                    expect(res.status).to.eq(403);
                    expect(res.body.error).to.eq(AuthErrorMessages.Forbidden);
                });
            });
        });

        it("Should reject request with invalid authToken cookie", () => {
            cy.setCookie("authToken", UserBuilder.generateInvalidToken());

            cy.request({
                method: "GET",
                url: QuizManagerEndpoints.authMe,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.eq(401);
                expect(res.body.error).to.eq(AuthErrorMessages.Unauthorized);
            });
        });

        it("Should block access to protected routes without login", () => {
            const urls = [
                QuizManagerEndpoints.quizzes,
                QuizManagerEndpoints.users,
                QuizManagerEndpoints.mySubmissions,
            ];

            urls.forEach((url) => {
                cy.request({
                    method: "GET",
                    url,
                    failOnStatusCode: false,
                }).then((res) => {
                    expect(res.status).to.eq(401);
                    expect(res.body.error).to.eq(AuthErrorMessages.Unauthorized);
                });
            });
        });
    });
});
