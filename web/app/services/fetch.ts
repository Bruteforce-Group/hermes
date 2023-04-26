import Service from "@ember/service";
import fetch from "fetch";
import { inject as service } from "@ember/service";
import SessionService from "./session";

interface FetchOptions {
  method?: string;
  headers?: {
    [key: string]: string;
  };
  body?: string;
}

export default class FetchService extends Service {
  @service declare session: SessionService;

  async fetch(url: string, options: FetchOptions = {}, isPollCall = false) {
    // Add the Google access token in a header (for auth) if the URL starts with
    // a frontslash, which will only target the application backend.
    if (Array.from(url)[0] == "/") {
      if (options.headers && options.headers["Hermes-Google-Access-Token"]) {
        /**
         * Don't modify headers with a Hermes-Google-Access-Token.
         * In other words, let the authenticator's `restore` method use
         * the session's previous access token to check if it still works.
         */
      } else {
        options.headers = {
          ...options.headers,
          "Hermes-Google-Access-Token":
            this.session.data.authenticated.access_token,
        };
      }
    }

    try {
      const resp = await fetch(url, options);

      // if it's a poll call, tell the SessionService if the response was a 401
      if (isPollCall) {
        this.session.pollResponseIs401 = resp.status === 401;
      }

      if (!resp.ok) {
        if (isPollCall && resp.status === 401) {
          // handle poll-call failures via the session service
          return;
        }
        throw new Error(`Bad response: ${resp.statusText}`);
      }

      return resp;
    } catch (err) {
      // Assume this case is a CORS error because of a redirect is to an OIDC
      // identity provider, so invalidate the session.
      if (
        err instanceof TypeError &&
        (err.message === "Network request failed" ||
          err.message === "Failed to fetch")
      ) {
        // Swallow error and handle gracefully.
        this.session.invalidate();
      } else {
        // Re-throw the error to be handled at the call site.
        throw err;
      }
    }
  }
}

declare module "@ember/service" {
  interface Registry {
    fetch: FetchService;
  }
}
