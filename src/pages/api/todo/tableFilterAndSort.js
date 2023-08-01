//* Серверная пагинация для таблицы todo.


//* секция Библиотеки c функциями
import { getCookies, getCookie, setCookie, removeCookies } from "cookies-next";
import NextConnect from "next-connect";
import SimpleSchema, { Integer, Any, oneOf } from "simpl-schema";
import _ from "lodash";
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
    filter: { type: Object, blackbox: true }, // любые поля. Для раздела в панели, это только name
    sortConfig: Object,
    "sortConfig.field": String,
    "sortConfig.direction": { type: String, allowedValues: ["asc", "desc"] }, // asc, desc
    selectedPage: Integer,
    pageSize: Integer,
    // если true, то вернуть в том числе архивированные записи
    isArchived: Boolean,
    // объект-фильтр полей результата. Оставьте пустым, чтобы получить все поля. Дайте объект типа {createdAt: 1} чтобы получить только указанные поля. Дайте объект типа {createdAt: 0} чтобы получить все поля, кроме указанных.
    projection: { type: Object, blackbox: true },
  },
  serverHelpers.simpleSchemaOptions
);

export let resultSchema = {};

/**
 * Фильтрация всех записей, предназначено для таблицы. Если не указан search и другие опции - вернется первые 100 записей, отсортированные по updatedAt
 */
async function handler(req, res) {
  try {
    let data = req.body || {};

    dataSchema.clean(data, {});
    dataSchema.validate(data, {});

    let {
      projection = {},
      isArchived = true,
      filter = {},
      sortConfig = {},
      selectedPage = 1,
      pageSize = 50,
    } = data;

    let query = { ...filter };
    if (!isArchived) {
      query.isArchived = { $ne: true };
    }

    let cursor = Collections.todos.find(query);
    if (!sortConfig.field) {
      sortConfig.field = "createdAt";
      sortConfig.direction = 'desc';
    }
    if (sortConfig.direction == "desc") {
      sortConfig.direction = -1;
    } else {
      sortConfig.direction = 1;
    }

    cursor = cursor.sort({ [sortConfig.field]: sortConfig.direction });
    let skip = (selectedPage - 1) * pageSize;
    let limit = pageSize;
    cursor = cursor.skip(skip).limit(limit);

    let allDataLength = await Collections.todos.count()

    let pageRows = [];
    let filteredCount = 0;
    await Promise.all([
      cursor.projection(projection).then((rows) => (pageRows = rows)),
      Collections.todos
        .count(filter)
        .then((count) => (filteredCount = count)),
    ]);

    let firstPage = 1;
    let remainder = filteredCount % pageSize;
    let lastPage = Math.floor(filteredCount / pageSize);
    if (remainder) lastPage++;
    if (selectedPage > lastPage) selectedPage = lastPage; // такая ситуация может возникнуть при смене кол-ва строк

    let pageNumbersToShow = [
      selectedPage - 2,
      selectedPage - 1,
      selectedPage,
      selectedPage + 1,
      selectedPage + 2,
    ].filter((item) => item >= firstPage && item <= lastPage);

    let result = {
      pageRows,
      firstPage,
      lastPage,
      selectedPage,
      pageRows,
      pageNumbersToShow,
      dataLength: allDataLength,
    };

    return apiResponses.success(res, null, result);
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
