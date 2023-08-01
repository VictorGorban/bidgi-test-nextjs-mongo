//* секция Библиотеки c функциями
import { getCookies, getCookie, setCookie, removeCookies } from "cookies-next";
import NextConnect from "next-connect";
import SimpleSchema, { Integer, Any, oneOf } from "simpl-schema";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import waitDB from "@src/middlewares/waitDB";
import withUser from "@src/middlewares/withUser";
import * as serverHelpers from "@src/serverHelpers";
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
  { userId: { type: String, required: true } },
  serverHelpers.simpleSchemaOptions
);

export let resultSchema = {};

/**
 * Получение особи без связанных данных
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

    let { userId } = data;

    let user = await Collections.users.findOne({
      _id: userId,
    });
    if (!user) throw new Error("Пользователь не найден. Войдите в систему.");

    if (
      user.roles?.includes("globalAdmin") &&
      !req.user.roles?.includes("globalAdmin")
    ) {
      throw new Error(
        "Данные глобального админа может узнать только другой глобальный админ"
      );
    }

    // глобальный админ может получать всех. Админ компании может получать юзеров только своей компании
    if (!req.user.roles?.includes("globalAdmin")) {
      // если инициатор - обычный админ компании, он может получить юзера только своей компании
      if (req.user.companyId != user.companyId) {
        throw new Error("Попытка получить объект другой компании");
      }
    }

    // пусть лучше будет получение даже архивных. Для 
    // if (user.isArchived) {
    //   throw new Error("Пользователь архивирован");
    // }

    return apiResponses.success(res, null, user);
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
