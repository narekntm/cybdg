describe("Describe Actions", () => {
  before(() => {
    cy.visit("https://example.cypress.io/");
  });
  after(() => {
    cy.visit("https://example.cypress.io/");
  });

  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/actions");
  });
  afterEach(() => {
    cy.visit("https://example.cypress.io/utilities");
  });

  context("Tests for Inputs", () => {
    it("inputs email", () => {
      cy.get(".action-email").type("test@gmail.com").should("have.value", "test@gmail.com");
    });
    it("cheks disabled", () => {
      cy.get(".form-control action-disabled").should("have.value", "desabled");
    });
    it("inputs password", () => {
      cy.get(".action-focus").type("pass-123").should("have.value", "pass-123");
    });
    it("inputs full name", () => {
      cy.get(".action-focus").type("pass-123").should("have.value", "pass-123");
    });
    it("inputs full name", () => {
      cy.get("#fullName1").type("Anna gGevorgyan").should("have.value", "Anna gGevorgyan");
    });

    it("inputs descr", () => {
      cy.get("#description").type("Some description").should("have.value", "Some description");
    });
    it("inputs coupon code", () => {
      cy.get("#couponCode1").type("12345678910");
    });
  });

  context("Tests for Texts", () => {
    it("Should do some actions with texts", () => {
      cy.get(":nth-child(2) > .well > form > :nth-child(1) > label").should("be.visible");
      cy.get("form > :nth-child(2) > label").should("be.visible");
      cy.get(":nth-child(5) > .well > form > .form-group > label").should("be.visible");
      cy.get(":nth-child(8) > .well > form > .form-group > label").should("be.visible");
      cy.get(":nth-child(11) > .well > form > .form-group > label").should("be.visible");
      cy.get(".action-div").dblclick();
      cy.get(".action-div").should("not.be.visible");
      cy.get(".action-input-hidden").should("be.visible");
    });
  });
});

describe("Describe Assertions", () => {
  before(() => {
    cy.visit("https://example.cypress.io/");
  });
  after(() => {
    cy.visit("https://example.cypress.io/");
  });

  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/assertions");
  });
  afterEach(() => {
    cy.visit("https://example.cypress.io/utilities");
  });

  context("Tests for Table", () => {
    it("Should select and check table", () => {
      cy.get(":nth-child(3) > .well").find(".success > :nth-child(2)").should("have.text", "Column content");
    });
    it("Should find link and do some checks", () => {
      cy.get(".assertions-link").should("have.class", "active").and("have.attr", "href").and("include", "cypress.io");
    });
  });
  context("Tests for Texts", () => {
    it("Should check first text", () => {
      cy.get(":nth-child(17) > .well").find(".assertions-p > :nth-child(1)").should("contain.text", "first");
    });
    it("Should check second text", () => {
      cy.get(":nth-child(17) > .well").find(".assertions-p > :nth-child(2)").should("contain.text", "second");
    });
    it("Should check third text", () => {
      cy.get(":nth-child(17) > .well").find(".assertions-p > :nth-child(3)").should("contain.text", "third");
    });
  });
});
