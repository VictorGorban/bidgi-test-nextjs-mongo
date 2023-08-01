//* секция Библиотеки c функциями
import { getCookies, getCookie, setCookie, removeCookies } from "cookies-next";
import uniqid from "uniqid";
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

export let resultSchema = {};

export let dataSchema = new SimpleSchema(
  {
    todoId: String,
  },
  serverHelpers.simpleSchemaOptions
);

/**
 * Создание новой особи
 */
async function handler(req, res) {
  try {
    if (!req.user) {
      throw new Error("Сначала войдите в систему");
    }

    if (
      !req.user?.roles.includes("admin")
    ) {
      throw new Error("Недостаточно прав");
    }

    let data = req.body || {};
    dataSchema.clean(data, {});
    dataSchema.validate(data, {});

    let todoData = data;

    await Collections.todos.updateOne(
      { _id: todoData.todoId },
      { $set: { isCompleted: true } }
    );

    return apiResponses.success(res, null, null);
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
