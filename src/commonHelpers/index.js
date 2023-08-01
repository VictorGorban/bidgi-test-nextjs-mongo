//* секция Библиотеки c функциями
import dayjs from "dayjs";
import _ from "lodash";
import convertRu from "convert-layout/ru";
import uniqid from "uniqid";

//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

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

export function randomInt(min = 0, max = 1_000_000_000) {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

export function randomString() {
  // случайное число от min до (max+1)
  let rand = uniqid.process();
  return rand;
}

export function randomStringProcess() {
  // случайное число от min до (max+1)
  let rand = uniqid.process();
  return rand;
}

export function randomStringFull() {
  // случайное число от min до (max+1)
  let rand = uniqid();
  return rand;
}

export function randomIntString(min = 0, max = 9, length = 10) {
  // случайное число от min до (max+1)
  let result = "";
  for (let i = 0; i < length; i++) {
    result += randomInt(min, max);
  }
  return result;
}

export function dateDiff(date1, date2, unit) {
  let result = dayjs(date1).diff(date2 || new Date(), unit || "years");
  return result;
}

export function formatDate(date, format) {
  if (!date) return "";
  let result = dayjs(date).format(format || "DD.MM.YYYY");
  if (result == "Invalid Date") {
    return date;
  }
  return result;
}

export function formatDateFull(date, format) {
  if (!date) return "";
  let result = dayjs(date).format(format || "DD.MM.YYYY HH:mm:ss");
  if (result == "Invalid Date") {
    return date;
  }
  return result;
}

export function parseDate(string, format) {
  let result = dayjs(string, format || "DD.MM.YYYY").toDate();

  return result;
}

export function parseTime(string, format) {
  let result = dayjs(string, format || "DD.MM.YYYY HH:mm").toDate();

  return result;
}

export function formatTime(date, format) {
  if (!date) return "";
  let result = dayjs(date).format(format || "HH:mm:ss");

  return result;
}

export function formatBool(bool) {
  return bool ? "Да" : "Нет";
}

export function ruToEn(value) {
  let converted = value;
  const cyrillicPattern = /[а-яА-ЯЁё]/;
  let isRussian = cyrillicPattern.test(value);
  if (isRussian) {
    converted = convertRu.toEn(value);
  }

  return converted;
}

export function getRussianStatus(status) {
  switch (status) {
    case "created":
      return "Создано";
    case "edited":
      return "Редактировано";
    case "edited_by_admin":
      return "Редактировано администратором";
    default:
      return type;
  }
}
