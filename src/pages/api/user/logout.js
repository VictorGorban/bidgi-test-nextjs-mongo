//* секция Библиотеки c функциями
import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";
import NextConnect from "next-connect";
import SimpleSchema, { Integer, Any, oneOf } from "simpl-schema";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import waitDB from "@src/middlewares/waitDB";
import withUser from "@src/middlewares/withUser";
import * as apiResponses from "@src/serverHelpers/responses";
import * as Collections from "@src/ORM/Collections";
import * as serverHelpers from "@src/serverHelpers";
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

export let dataSchema = new SimpleSchema({}, serverHelpers.simpleSchemaOptions);

export let resultSchema = {};

/**
 * Логаут с сайта
 */
async function handler(req, res) {
  try {
    if (!req.user) {
      throw new Error("Сначала войдите в систему");
    }

    let data = req.body || {};

    dataSchema.clean(data, {});
    dataSchema.validate(data, {});

    let { user_id, token } = getCookies({ req, res });
    await Collections.users.updateOne(
      {
        _id: user_id,
      },
      {
        $pull: {
          loginTokens: token,
        },
      }
    );

    deleteCookie("user_id", {
      req,
      res,
    }); // 30 дней актуальны
    deleteCookie("token", {
      req,
      res,
    });

    return apiResponses.success(res, null, {});
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
