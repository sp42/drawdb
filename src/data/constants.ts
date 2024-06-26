import i18n from "../i18n/i18n";

export const sqlDataTypes: string[] = [
  "INT",
  "SMALLINT",
  "BIGINT",
  "DECIMAL",
  "NUMERIC",
  "FLOAT",
  "DOUBLE",
  "REAL",
  "CHAR",
  "VARCHAR",
  "TEXT",
  "DATE",
  "TIME",
  "TIMESTAMP",
  "DATETIME",
  "BOOLEAN",
  "BINARY",
  "VARBINARY",
  "BLOB",
  "JSON",
  "UUID",
  "ENUM",
  "SET"
];

export const tableThemes: string[] = [
  "#f03c3c",
  "#ff4f81",
  "#bc49c4",
  "#a751e8",
  "#7c4af0",
  "#6360f7",
  "#7d9dff",
  "#32c9b0",
  "#3cde7d",
  "#89e667",
  "#ffe159",
  "#ff9159"
];

export const noteThemes: string[] = [
  "#ffdfd9",
  "#fcf7ac",
  "#cffcb1",
  "#c7d2ff",
  "#e7c7ff"
];

export const defaultBlue: string = "#175e7a";
export const defaultNoteTheme: string = "#fcf7ac";
export const tableHeaderHeight: number = 50;
export const tableWidth: number = 200;
export const tableFieldHeight: number = 36;
export const tableColorStripHeight: number = 7;

export enum Cardinality {
  ONE_TO_ONE = i18n.t("one_to_one"),
  ONE_TO_MANY = i18n.t("one_to_many"),
  MANY_TO_ONE = i18n.t("many_to_one")
};

export enum Constraint {
  NONE = "No action",
  RESTRICT = "Restrict",
  CASCADE = "Cascade",
  SET_NULL = "Set null",
  SET_DEFAULT = "Set default"
};

export enum Tab {
  TABLES = "1",
  RELATIONSHIPS = "2",
  AREAS = "3",
  NOTES = "4",
  TYPES = "5"
};

export enum ObjectType {
  NONE = 0,
  TABLE = 1,
  AREA = 2,
  NOTE = 3,
  RELATIONSHIP = 4,
  TYPE = 5
};

export enum Action {
  ADD = 0,
  MOVE = 1,
  DELETE = 2,
  EDIT = 3,
  PAN = 4
};

export enum State {
  NONE = 0,
  SAVING = 1,
  SAVED = 2,
  LOADING = 3,
  ERROR = 4
};

export enum MODAL {
  NONE = 0,
  IMG = 1,
  CODE = 2,
  IMPORT = 3,
  RENAME = 4,
  OPEN = 5,
  SAVEAS = 6,
  NEW = 7,
  IMPORT_SRC = 8,
  TABLE_WIDTH = 9,
  LANGUAGE = 10
};

export enum STATUS {
  NONE = 0,
  WARNING = 1,
  ERROR = 2,
  OK = 3
};

export enum SIDESHEET {
  NONE = 0,
  TODO = 1,
  TIMELINE = 2
};
