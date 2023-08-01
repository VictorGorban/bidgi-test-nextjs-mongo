import _ from "lodash";
import Template from "./mongoTemplate";
import SimpleSchema from "simpl-schema";
let { Any, Integer, oneOf }  = SimpleSchema;
import * as serverHelpers from "@main/serverHelpers";

export let collectionSchema = new SimpleSchema(
  {
    _id: String,
    createdAt: Date,
    updatedAt: Date,
    email: String,
    status: String,
    name: String,
    username: { type: String, required: true },
    // пароль сохраняется в виде array-like объекта
    password: { type: Buffer, blackbox: true },
    loginTokens: [String],
    roles: { type: Array, required: true, minCount: 1 },
    "roles.$": {
      type: String,
      allowedValues: [
        "admin",
        "globalAdmin",
        "Работник",
      ],
    },
    companyId: String,
  },
  serverHelpers.simpleSchemaOptions
);

export default class CollectionClass extends Template {
  static collectionName = "users";

  static indexes = [
    {
      definition: { username: 1 },
      options: {
        unique: true,
        sparse: true,
      },
    },
  ];

  static schema = collectionSchema;
}
