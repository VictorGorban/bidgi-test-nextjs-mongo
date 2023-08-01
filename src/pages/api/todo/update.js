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
    _id: {type: String, required: true},
    username: String,
    email: String,
    description: String,
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

    let existingTodo = await Collections.todos.findOne({ _id: todoData._id });
    //* На клиенте поле посылается только тогда, когда оно изменилось. Поэтому здесь можно просто проверять наличие todoData.description.
    //* Но чтобы не зависеть от фронтенда, лучше всего проверять полноценно.
    if (todoData.description && existingTodo.description != todoData.description) {
      todoData.isEdited = true;
    }

    let updateSet = { ...todoData, _id: undefined };

    let updateResult = await Collections.todos.updateOne(
      { _id: todoData._id },
      { $set: updateSet }
    );

    let updatedTodo = updateResult.affectedDocuments;

    console.log("updatedTodo", todoData._id, updatedTodo);

    return apiResponses.success(res, null, updatedTodo);
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
