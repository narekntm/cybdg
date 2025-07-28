import "./commands";
import { setupTestUsers } from "./QuizManagerSetup";

before(() => {
  return setupTestUsers();
});
