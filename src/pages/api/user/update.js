//* секция Библиотеки c функциями
import { getCookies, getCookie, setCookie, removeCookies } from "cookies-next";
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
    _id: { type: String },
    name: { type: String },
    roles: { type: Array },
    "roles.$": {
      type: String,
      required: true,
      allowedValues: [
        "admin",
        "globalAdmin",
        "Технолог",
        "Фасовщик",
        "Сцеживание",
        "Активация",
        "Маточное стадо",
      ],
    },
    password: String,
    username: String,
    email: String,
  },
  serverHelpers.simpleSchemaOptions
);

export let resultSchema = {};

/**
 * Обновление полей пользователя. Данные для входа (email, username, password) меняются отдельно, в отдельной
 */
async function handler(req, res) {
  try {

    if (!req.user) {
      throw new Error("Сначала войдите в систему");
    }

    if (
      !req.user.roles?.includes("admin")
    ) {
      throw new Error("Недостаточно прав");
    }

    let data = req.body || {};
    dataSchema.clean(data, {});
    dataSchema.validate(data, {});

    let user = await Collections.users.findOne({
      _id: data._id,
    });
    if (!user) throw new Error("Пользователь не найден");

    if (
      user.roles?.includes("globalAdmin") &&
      !req.user.roles?.includes("globalAdmin")
    ) {
      throw new Error(
        "Данные глобального админа может редактировать только глобальный админ"
      );
    }

    let updateSet = { ...data, _id: undefined };

    if (updateSet.username) {
      let usernameUser = await Collections.users.findOne({
        username: data.username,
      });

      if (usernameUser && usernameUser._id != req.user._id) {
        throw new Error("Пользователь с этим username уже существует");
      }
    }

    if (updateSet.password) {
      updateSet.password = await hashPassword(updateSet.password);
    }

    console.log('updateUser, final updateSet', updateSet)

    let updateResult = await Collections.users.updateOne(
      { _id: data._id },
      { $set: updateSet }
    );

    let updatedUser = updateResult.affectedDocuments;

    return apiResponses.success(res, null, updatedUser);
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
