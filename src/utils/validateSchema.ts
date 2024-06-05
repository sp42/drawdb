import { Validator } from "jsonschema";
import { ddbSchema, jsonSchema } from "../data/schemas";

export function jsonDiagramIsValid(obj: any): boolean {
  return new Validator().validate(obj, jsonSchema).valid;
}

export function ddbDiagramIsValid(obj: any): boolean {
  return new Validator().validate(obj, ddbSchema).valid;
}
