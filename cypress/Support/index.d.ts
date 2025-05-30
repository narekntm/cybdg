declare namespace Cypress {
  interface Chainable<Subject> {
    safeFixture(fixturePath: string, options?: Partial<Timeoutable>): Chainable<Subject>;
    
    clickOutside(): Chainable<Subject>;
  }
}
