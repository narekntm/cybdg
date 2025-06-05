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
  env: {},
  e2e: {
    baseUrl: 'https://example.cypress.io/',
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      return plugin(on, config);
    },
    specPattern: "Cypress/Tests/{E2E,API,UI}/**/*.ts",
    supportFile: e2eOptions.supportFile,
  },
});
