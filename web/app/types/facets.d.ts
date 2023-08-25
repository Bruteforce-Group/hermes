import { FacetName } from "hermes/components/header/toolbar";

/**
 * E.g., { docType: { "API": { count: 1, isSelected: false }}}
 */
export type FacetDropdownGroups = {
  [name in FacetName]: FacetRecord;
};

/**
 * E.g., {count: 1, isSelected: false}
 */
export type FacetDropdownObjectDetails = {
  count: number;
  isSelected: boolean;
};

export type FacetRecord = Record<string, FacetDropdownObjectDetails>;
export type FacetRecords = Record<string, FacetRecord>;
