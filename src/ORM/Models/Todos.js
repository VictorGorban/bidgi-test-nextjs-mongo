import _ from "lodash";
import Template from "./mongoTemplate";
import SimpleSchema from "simpl-schema";
let { Any, Integer, oneOf } = SimpleSchema;
import * as serverHelpers from "@main/serverHelpers";

export let collectionSchema = new SimpleSchema(
  {
    _id: String,
    createdAt: Date,
    updatedAt: Date,
    email: String,
    username: String,
    description: String,
    isCompleted: Boolean,
    isEdited: Boolean,
  },
  serverHelpers.simpleSchemaOptions
);

export default class CollectionClass extends Template {
  static collectionName = "todos";

  static indexes = [
    // {
    //   definition: { name: 1 },
    //   options: { unique: true },
    // },
  ];

  static schema = collectionSchema;
}
