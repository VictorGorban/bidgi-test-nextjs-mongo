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
import * as commonHelpers from "@src/commonHelpers";
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
    login: { type: String, required: true },
    password: { type: String, required: true },
  },
  serverHelpers.simpleSchemaOptions
);

/**
 * Логин на сайт
 */
async function handler(req, res) {
  try {
    let data = req.body || {};

    dataSchema.clean(data, {});
    dataSchema.validate(data, {});

    let token = commonHelpers.randomString();
    let findQuery = {
      $or: [{ username: data.login }, { email: data.login }],
    };
    let user = await Collections.users.findOne(findQuery);
    if (!user) return apiResponses.error(res, "Пользователь не найден. Войдите в систему.");

    if (!(await verifyPassword(data.password, user.password?.buffer)))
      return apiResponses.error(res, "Неверный пароль");

    let updateInfo = await Collections.users.updateOne(findQuery, {
      $push: {
        loginTokens: token,
      },
    });

    let updatedUser = updateInfo.affectedDocuments;
    delete updatedUser.password;

    setCookie("user_id", user._id, {
      req,
      res,
      sameSite: true,
      maxAge: 60 * 60 * 24 * 30,
    }); // 30 дней актуальны
    setCookie("token", token, {
      req,
      res,
      sameSite: true,
      maxAge: 60 * 60 * 24 * 30,
    });

    return apiResponses.success(res, null, {
      userId: user._id,
      token,
      user: updatedUser,
    });
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
