import {
  QuestionType,
  QuizCreationData,
  QuizInfo,
  QuizStatus,
  Role,
  User,
  UserBase,
} from "Models/Arevik/QuizManagerModels/QuizManagerModels"

export class QuizManagerGenerators {
  static adminUser: User = {
    id: "manager1",
    email: "manager@quizz.com",
    password: "manager123",
    role: Role.Manager,
  };

  static user1: UserBase = {
    id: "user1",
    email: "user1@quizz.com",
    role: Role.User,
  };

  static user1WithPassword: User = {
    ...QuizManagerGenerators.user1,
    password: "user123",
  };

  static user2: UserBase = {
    id: "user2",
    email: "user2@quizz.com",
    role: Role.User,
  };
  static user2WithPassword: User = {
    ...QuizManagerGenerators.user2,
    password: "user123",
  };