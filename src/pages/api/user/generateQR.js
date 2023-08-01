//* секция Библиотеки c функциями
import { getCookies, getCookie, setCookie, removeCookies } from "cookies-next";
import fs from "fs";
import path from "path";
import bwipjs from "bwip-js";
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
    userId: { type: String, required: true },
  },
  serverHelpers.simpleSchemaOptions
);

/**
 * Логин на сайт
 */
async function handler(req, res) {
  try {
    if (!req.user) {
      throw new Error("Сначала войдите в систему");
    }
    if (!req.user?.roles.includes("admin")) {
      throw new Error("Это действие доступно только администратору компании");
    }

    let data = req.body || {};

    dataSchema.clean(data, {});
    dataSchema.validate(data, {});

    let user = await Collections.users.findOne({ _id: data.userId });
    if (!user) return apiResponses.error(res, "Пользователь не найден");

    // сохранить в файл не получится, т.к. nodejs сервит файлы статически, а не динамически (новые файлы в проде не попадают в выдачу). В dev-е хостинг динамический, поэтому и работает.

    let pngBuffer = await bwipjs.toBuffer({
      bcid: "qrcode",
      text: `${user.username} | qrpass`,
      scale: 5,
      height: 40, // Bar height, in millimeters
      width: 40,
      padding: 10,
      includetext: true,
      textxalign: "center",
      backgroundcolor: "FFFFFF",
    });

    let pngBase64 = pngBuffer.toString("base64");

    let fileLink = `data:image/png;base64,${pngBase64}`;

    return apiResponses.success(res, null, {
      fileLink,
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
