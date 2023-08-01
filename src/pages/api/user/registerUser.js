//* секция Библиотеки c функциями
import uniqid from "uniqid";
import NextConnect from "next-connect";
import SimpleSchema, { Integer, Any, oneOf } from "simpl-schema";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import waitDB from "@src/middlewares/waitDB";
import withUser from "@src/middlewares/withUser";
import * as serverHelpers from "@src/serverHelpers";
import * as commonHelpers from "@src/commonHelpers";
import { hashPassword } from "@src/serverHelpers/passwordUtil";
import * as apiResponses from "@src/serverHelpers/responses";
import * as Collections from "@src/ORM/Collections";
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

export let dataSchema = new SimpleSchema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: String,
    companyId: String,
    roles: { type: Array, required: true },
    "roles.$": {
      type: String,
      required: true,
      allowedValues: [
        "admin",
        "Работник",
      ],
    },
    password: { type: String, required: true },
  },
  serverHelpers.simpleSchemaOptions
);

/**
 * Регистрация работника или админа компании
 */
async function handler(req, res) {
  try {
    if (
      !req.user?.roles?.includes("admin")
    ) {
      throw new Error("Недостаточно прав");
    }

    let data = req.body || {};

    dataSchema.clean(data, {});
    dataSchema.validate(data, {});

    let { username, name, email, password, roles, companyId } = data;

    console.log("in register", data);

    let usersMatch = [{ username }];
    if (email) {
      usersMatch.push({ email });
    }

    let existingUser = await Collections.users.findOne({
      $or: usersMatch,
    });

    if (existingUser)
      return apiResponses.error(
        res,
        "Указанное имя пользователя или email уже есть в системе"
      );

    let passwordHash = await hashPassword(password);
    let userId = Collections.users.generateDocumentId();

    let userObject = {
      _id: userId,
      username,
      name,
      email: email,
      password: passwordHash,
      companyId: companyId || req.user.companyId, // админ компании может регистрировать юзеров только своей компании.
      roles,
      loginTokens: [],
    };
    let insertedUser = await Collections.users.insertOne(userObject);

    return apiResponses.success(res, null, insertedUser);
  } catch (e) {
    console.error(e);
    return apiResponses.error(res, e.message || e);
  }
}

export default NextConnect({
  attachParams: true,
  onError: (e, req, res, next) => {
    console.error(e);
    return apiResponses.error(res, e.message || e);
  },
})
  .use(waitDB)
  .use(withUser)
  .post(handler);
