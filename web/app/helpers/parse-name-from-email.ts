import { helper } from "@ember/component/helper";
import parseNameFromEmail from "hermes/utils/parse-name-from-email";

export interface ParseNameFromEmailHelperSignature {
  Args: {
    Positional: [email?: string];
    Return: string | undefined;
  };
}

const parseNameFromEmailHelper = helper<ParseNameFromEmailHelperSignature>(
  ([email]) => {
    return parseNameFromEmail(email);
  }
);

export default parseNameFromEmailHelper;

declare module "@glint/environment-ember-loose/registry" {
  export default interface Registry {
    "parse-name-from-email": typeof parseNameFromEmailHelper;
  }
}
