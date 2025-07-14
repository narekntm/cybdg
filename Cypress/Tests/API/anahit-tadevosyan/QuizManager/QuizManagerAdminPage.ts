import {QuizManagerBuilders} from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import {QuizManagerGenerators} from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";
import {QuizStatus} from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

describe("QuizManager Admin Page", () => {
    const baseUrl = "/login.html";
    before(()=> {
        cy.visit(baseUrl);
        QuizManagerBuilders.login(QuizManagerGenerators.adminUser.email, QuizManagerGenerators.adminUser.password).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.include({})
        })
        QuizManagerBuilders.getCurrentUser().then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.deep.eq(QuizManagerGenerators.adminUser);
        });
        // QuizManagerBuilders.getQuizzes().then((response) => {
        //     expect(response.status).to.eq(200);
        //     expect(response.body).to.include([QuizManagerGenerators.initialQuiz1, QuizManagerGenerators.initialQuiz2])
        // })
        QuizManagerBuilders.getUsers().then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.deep.eq([QuizManagerGenerators.user1, QuizManagerGenerators.user2]);
        })
    })
   describe('Add Quiz', () => {

   })
    describe('Status changes check', () => {
        it('Archive Quiz', () => {
            QuizManagerBuilders.archiveQuiz(QuizManagerGenerators.initialQuiz1.id).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.include({"success":true});
            })
            QuizManagerBuilders.getQuizzes().then((response) => {
                expect(response.status).to.eq(200);
                cy.log({...QuizManagerGenerators.initialQuiz1,status: QuizStatus.Archived})
                expect(response.body).to.include([{...QuizManagerGenerators.initialQuiz1,status: QuizStatus.Archived}, QuizManagerGenerators.initialQuiz2]);
            })
        })

    })
})