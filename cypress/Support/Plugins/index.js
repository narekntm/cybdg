// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { existsSync } = require('fs')
const { join, resolve } = require('path')


const e2eOptions = {
  specPattern: 'Cypress/Tests/**/*.{js,jsx,ts,tsx}', supportFile: 'Cypress/Support/index.js',
}

module.exports = {
  plugin, e2eOptions,
}

/**
 *
 * @param {Cypress.PluginEvents} on
 * @param {Cypress.PluginConfigOptions} config
 * @param {boolean | undefined} isProjectConfig
 * @returns Cypress.PluginConfigOptions
 */
function plugin (on, config, isProjectConfig = true) {
  require('@cypress/grep/src/plugin')(config)

  on('task', {
    checkFixtureExists (fixtureName) {
      const pathToFixture = join(config?.fixturesFolder ?? '', fixtureName)
      return existsSync(pathToFixture)
    },
  })

  require('cypress-terminal-report/src/installLogsPrinter')(on, {
    printLogsToConsole: 'always',
    includeSuccessfulHookLogs: true,
  })

  return config
}
