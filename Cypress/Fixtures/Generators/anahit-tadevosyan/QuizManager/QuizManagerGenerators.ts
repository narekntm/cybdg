import {
    User,
    QuestionType,
    QuizData,
    QuizStatus,
    Role,
    UserBase
} from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

export class QuizManagerGenerators {
  static adminUser: User = {
    id: "admin1",
    email: "admin@example.com",
    password: "admin123",
    role: Role.Admin,
  };

  static user1: UserBase = {
    id: "user1",
    email: "user1@example.com",
    role: Role.User,
  };

    static user1WithPassword: User = {
        ...QuizManagerGenerators.user1,
        password: "user123"
    };

  static user2: UserBase = {
    id: "user2",
    email: "user2@example.com",
    role: Role.User,
  };
    static user2WithPassword: User = {
        ...QuizManagerGenerators.user2,
        password: "user123"
    };

  static invalidCredentials: User = {
        id: "user3",
        email: "user3@example.com",
        password: "user12345",
        role: Role.User,
    };
    static initialQuiz1: QuizData = {
        "id": "7349d238-b47d-41c6-82f0-3dad43088a0a",
        "title": "Welcome Quiz",
        "description": "A sample quiz available to all users",
        "questions": [
            {
                "id": "q1",
                "label": "What's your name?",
                "type": QuestionType.Input,
                "options": []
            },
            {
                "id": "q2",
                "label": "Your gender?",
                "type": QuestionType.Radio,
                "options": [
                    "Male",
                    "Female",
                    "Other"
                ]
            },
            {
                "id": "q3",
                "label": "Technologies you like",
                "type": QuestionType.Checkbox,
                "options": [
                    "JavaScript",
                    "Python",
                    "Go"
                ]
            },
            {
                "id": "q4",
                "label": "Country",
                "type": QuestionType.Dropdown,
                "options": [
                    "Armenia",
                    "USA",
                    "Germany"
                ]
            }
        ],
        "createdBy": "admin1",
        "assignedUsers": "all",
        "status": QuizStatus.Active
    }


    static initialQuiz2: QuizData = {

    "id": "3a70d3de-3626-4cfb-9f95-baadc4e19880",
    "title": "test 1 title",
    "description": "test 1 desc",
    "questions": [
        {
            "id": "q0",
            "label": "quaestion 1",
            "type": QuestionType.Input,
            "options": []
        },
        {
            "id": "q1",
            "label": "question radio 2",
            "type": QuestionType.Radio,
            "options": [
                "a",
                "b",
                "c"
            ]
        },
        {
            "id": "q2",
            "label": "question checkbox 3",
            "type": QuestionType.Checkbox,
            "options": [
                "c",
                "d",
                "e"
            ]
        },
        {
            "id": "q3",
            "label": "question dropdown 4",
            "type": QuestionType.Dropdown,
            "options": [
                "f",
                "g",
                "h"
            ]
        }
    ],
    "assignedUsers": "all",
    "status": QuizStatus.Draft,
    "createdBy": "admin1"
    };

}

