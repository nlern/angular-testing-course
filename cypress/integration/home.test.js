describe("Home Page", () => {
  beforeEach(() => {
    cy.fixture("courses.json").as("coursesJSON");
    cy.server();
    cy.route("/api/courses", "@coursesJSON").as("courses");
    cy.visit("/");
    cy.contains("All Courses");
    cy.wait("@courses");
  });

  it("should display a list of courses", () => {
    cy.get("mat-card").should("have.length", 9);
  });

  it("should display advanced courses when Advanced tab is clicked", () => {
    cy.get(".mat-tab-label").should("have.length", 2);

    cy.get(".mat-tab-label").last().click();

    cy.get(".mat-tab-body-active .mat-card-title")
      .its("length")
      .should("be.gt", 1);
    cy.get(".mat-tab-body-active .mat-card-title")
      .first()
      .should("contain", "Angular Security Course");
  });
});
