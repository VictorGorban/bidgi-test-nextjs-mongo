//* секция Библиотеки c функциями
import dayjs from "dayjs";
import _ from "lodash";
import convertRu from "convert-layout/ru";
// import nodemailer from "nodemailer";
import uniqid from "uniqid";

import crypto from "crypto";

//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

// let transporter = nodemailer.createTransport({
//   service: "Yandex", // no need to set host or port etc.
//   auth: {
//     user: "victorgorban2@ya.ru",
//     pass: "1999Gorban",
//   },
// });

export { default as submitObject } from "./submitObject";

export function validateEmail(email) {
  if (!email) return true;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );
}

export function validateUrl(url) {
  if (!url) return true;

  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  return true;
}

export async function sendMail(options) {
  console.log("in sendMail", options.to, options.subject, options.html.length);
  let defaultOptions = { from: "victorgorban2@ya.ru" };
  let mailOptions = {
    ...defaultOptions,
    ...options,
  };
  // console.log('mailOptions', mailOptions)
  let mailResult = await transporter.sendMail(mailOptions);

  return mailResult;
}

let simpleSchemaOptions = {
  clean: {
    // clean нужен в основном для преобразования типов. Лишние поля не убираю.
    mutate: true,
    filter: false, // убрать поля, которых нет в определении - нет, оставить на валидацию
    autoConvert: true,
    removeEmptyStrings: false,
    removeNullsFromArrays: false,
    trimStrings: true, // теперь мне не нужно триммить логин и пароль вручную
  },
  requiredByDefault: false,
};

export { simpleSchemaOptions };

// смотрим на поля в query. Берем их из prevState, возвращаем
export function revertUpdateQuery(query, prevState) {
  // console.log('revertUpdateQuery, prevState', prevState)

  let keysToCopy = [];

  for (let actionKey of Object.keys(query)) {
    if (actionKey == "$or") {
      let array = query[actionKey];
      for (let obj of array) {
        for (let key of Object.keys(obj)) {
          keysToCopy.push(key);
        }
      }
    } else {
      for (let key of Object.keys(query[actionKey])) {
        keysToCopy.push(key);
      }
    }
  }

  keysToCopy = _.uniq(keysToCopy);
  let result = {};
  for (let key of keysToCopy) {
    result[key] = prevState[key];
  }

  return { $set: result };
}
