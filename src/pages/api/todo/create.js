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
import { verifyPassword } from "@src/serverHelpers/passwordUtil";
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
    _id: String,
    username: String,
    email: { type: String, required: true },
    description: { type: String, required: true },
  },
  serverHelpers.simpleSchemaOptions
);

/**
 * Создание новой особи
 */
async function handler(req, res) {
  try {
    let data = req.body || {};
    dataSchema.clean(data, {});
    dataSchema.validate(data, {});

    let todoData = data;

    let insertedTodo = await Collections.todos.insertOne({
      ...todoData,
    });

    return apiResponses.success(res, null, insertedTodo);
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
