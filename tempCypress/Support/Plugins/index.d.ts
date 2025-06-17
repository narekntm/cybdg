export function plugin(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
  isProjectConfig?: boolean
): Cypress.PluginConfigOptions;

export const e2eOptions: { specPattern: string; supportFile: string };
