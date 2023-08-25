import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import FetchService from "hermes/services/fetch";

export default class ProjectRoute extends Route {
  @service("fetch") declare fetchSvc: FetchService;

  async model(params: any) {
    return await this.fetchSvc
      .fetch("/api/v1/projects/" + params.project_id)
      .then((response) => response?.json())
      .catch((e) => {
        console.error(e);
        return null;
      });
  }
}