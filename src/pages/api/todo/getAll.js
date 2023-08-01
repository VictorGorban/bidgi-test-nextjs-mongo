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
  {
    // если true, то вернуть в том числе архивированные записи
    isArchived: Boolean,
    // объект-фильтр полей результата. Оставьте пустым, чтобы получить все поля. Дайте объект типа {createdAt: 1} чтобы получить только указанные поля. Дайте объект типа {createdAt: 0} чтобы получить все поля, кроме указанных.
    projection: { type: Object, blackbox: true },
  },
  serverHelpers.simpleSchemaOptions
);

export let resultSchema = {};

/**
 * Получение всех особей компании
 */
async function handler(req, res) {
  try {
    
    let data = req.body || {};

    dataSchema.clean(data, {});
    dataSchema.validate(data, {});

    let { projection = {}, isArchived } = data;

    let query = {  };
    if (!isArchived) {
      query.isArchived = {$ne: true}
    }

    let todos = await Collections.todos
      .find(query)
      .sort({ updatedAt: -1 })
      .project(projection);

    return apiResponses.success(res, null, todos);
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
