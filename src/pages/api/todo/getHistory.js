//* секция Библиотеки c функциями
import { getCookies, getCookie, setCookie, removeCookies } from "cookies-next";
import NextConnect from "next-connect";
import SimpleSchema, { Integer } from "simpl-schema";
import EJSON from 'ejson'
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
    todoId: { type: String, required: true },
    maxItems: { type: Integer, defaultValue: 100 },
  },
  serverHelpers.simpleSchemaOptions
);

export let resultSchema = {};

/**
 * Получение истории изменения особи
 */
async function handler(req, res) {
  try {
    if (!req.user) {
      throw new Error("Сначала войдите в систему");
    }
    if (
      !req.user?.roles.includes("globalAdmin")
    ) {
      throw new Error("Недостаточно прав");
    }
    let data = req.body || {};

    dataSchema.clean(data, {}); 
    dataSchema.validate(data, {});

    let { todoId, maxItems } = data;

    let todo = await Collections.todos.findOne({
      _id: todoId,
    });
    if (!todo) throw new Error("Наименование рыбы не найдена");

    let history = [todo];

    let oplogHistory = await Collections.oplog
      .find({
        objectId: todoId,
        collectionName: "todos",
      })
      .sort({ createdAt: -1 })
      .limit(maxItems);

    // теперь мы создаем временный объект, и применяем обратное действие. Для insert и remove все понятно, а вот для update нужен хелпер.
    let tempObject = await Collections.todos.collection.insertAsync({
      ...todo,
      _id: undefined,
    });

    for (let logItem of oplogHistory) {
      logItem.revertMethodOptions = EJSON.parse(logItem.revertMethodOptions);
      logItem.revertMethodOptions[0] = { _id: tempObject._id };
      
      // todo вот тут что-то не так: возвращается последний вариант всегда
      await Collections.todos.collection[logItem.revertMethodName](
        ...logItem.revertMethodOptions
      );

      let updatedTempObject = await Collections.todos.findOne({
        _id: tempObject._id,
      });
      history.push({
        ...updatedTempObject,
        createdAt: todo.createdAt,
        updatedAt: logItem.createdAt,
        _id: todo._id,
      });
    }

    await Collections.todos.collection.removeAsync({
      _id: tempObject._id,
    });

    return apiResponses.success(res, null, history);
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
