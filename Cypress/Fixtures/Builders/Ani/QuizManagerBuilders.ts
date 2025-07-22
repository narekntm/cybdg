import { QuizManagerEndpoints } from "EndPoints/Ani/QuizManagerEndpoints";
import { User } from "Models/Ani/QuizManagerModels";

export class QuizManagerBuilders {
  static token: string;
  static Auth = () => {
    return cy
      .request("POST", QuizManagerEndpoints.Auth, {
        email: "testmanager@example.com",
        password: "test123",
      })
      .then((res) => {
        expect(res.status).to.eq(200);
        QuizManagerBuilders.token = res.body.token;
      });
  };
  static User = (newUser: User) => {
    return cy.request({
      method: "POST",
      url: QuizManagerEndpoints.Users,
      headers: {
        Authorization: `Bearer ${QuizManagerBuilders.token}`,
      },
      body: newUser,
    });
  };
}
