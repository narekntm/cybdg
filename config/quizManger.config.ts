import { defineConfig } from "cypress";
import { e2eOptions, plugin } from "Plugins/index";

export default defineConfig({
  chromeWebSecurity: false,
  fileServerFolder: "Cypress",
  fixturesFolder: "Cypress/Fixtures/Static",
  defaultCommandTimeout: 15000,
  requestTimeout: 120000,
  responseTimeout: 120000,
  viewportWidth: 1920,
  viewportHeight: 1080,
  includeShadowDom: true,
  screenshotsFolder: "Cypress/Support/Results/Screenshots",
  videosFolder: "Cypress/Support/Results/Videos",
  trashAssetsBeforeRuns: true,
  reporterOptions: {
    topLevelSuite: "Test",
  },
  retries: {
    runMode: 0,
    openMode: 0,
  },
  env: {
    API_URL: "http://127.0.0.1:5353/be", // API base URL
    MANAGER_EMAIL: "manager@quizz.com",
    MANAGER_PASSWORD: "manager123",
    USER1_EMAIL: "user1@quizz.com",
    USER1_PASSWORD: "user123",
    USER2_EMAIL: "user2@quizz.com",
    USER2_PASSWORD: "user123",
  },
  e2e: {
    baseUrl: "http://127.0.0.1:5353",
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      return plugin(on, config);
    },
    specPattern: "Cypress/Tests/{E2E,API,UI}/**/QuizManager/**/*.ts",
    supportFile: e2eOptions.supportFile,
  },
});
