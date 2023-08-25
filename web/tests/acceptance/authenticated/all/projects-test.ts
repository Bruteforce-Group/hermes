import { MirageTestContext, setupMirage } from "ember-cli-mirage/test-support";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";
import { visit } from "@ember/test-helpers";
import { getPageTitle } from "ember-page-title/test-support";
import { setupApplicationTest } from "ember-qunit";

interface AuthenticatedAllProjectsRouteTestContext extends MirageTestContext {}
module("Acceptance | authenticated/all/projects", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    await authenticateSession({});
  });

  test("the page title is correct", async function (this: AuthenticatedAllProjectsRouteTestContext, assert) {
    await visit("/all/projects");
    assert.equal(getPageTitle(), "All Projects | Hermes");
  });

  test("it renders a list of projects", async function (this: AuthenticatedAllProjectsRouteTestContext, assert) {
    this.server.create("document", { product: "Terraform" });
    this.server.create("document");

    const firstDoc = this.server.schema.document.first().attrs;
    const secondDoc = this.server.schema.document.all().models[1].attrs;
    this.server.create("project", {
      documents: [firstDoc],
    });
    this.server.create("project", {
      documents: [firstDoc, secondDoc],
    });
    this.server.create("project", {
      jiraObject: {
        key: "HERMES-123",
        url: "https://jira.example.com/browse/HERMES-123",
        priority: "High",
        status: "In Progress",
        assignedTo: "testuser@example.com",
      },
    });

    await visit("/all/projects");

    await this.pauseTest();
  });
});