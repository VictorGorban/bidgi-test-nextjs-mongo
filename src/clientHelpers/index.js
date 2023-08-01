//* секция Библиотеки c функциями
import dayjs from "dayjs";
import _ from "lodash";
import weekday from "dayjs/plugin/weekday";
import customParseFormat from "dayjs/plugin/customParseFormat";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

dayjs.extend(customParseFormat);
dayjs.extend(weekday);

export { default as submitObject } from "./submitObject";

export function redirectLink(link, router) {
  console.log("redirectLink, link, history", link, router);
  router.push(link);
}

export function goBack(history) {
  console.log("goBack, history", history);
  if (history.length > 1) {
    history.goBack();
  } else {
    history.push("/");
  }
}

export function preventTab(e) {
  // console.log("preventTab", e);
  if (e.keyCode == 9 && !e.shiftKey) {
    e?.preventDefault();
    e?.stopPropagation();
    return false;
  }
  return e.keyCode;
}

export function preventShiftTab(e) {
  // console.log("preventTab", e);
  if (e.keyCode == 9 && e.shiftKey) {
    e?.preventDefault();
    e?.stopPropagation();
    return false;
  }
  return e.keyCode;
}

export function readFileText(file) {
  console.log("in readFileText");
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = function () {
      reject(reader.error);
    };
  });
}

export function handleChangeItem(e, item, field, type = "text", itemFunction) {
  let el = e.currentTarget;
  let value;
  if (field == "email") {
    value = el.value.toLowerCase();
  } else {
    value = el.value;
  }
  // console.log('el', el)
  if (el.options) {
    value = el.options[el.selectedIndex];
  }

  value = `${value}`.trim();

  if (type == "float") {
    value = parseFloat(value);
  } else if (type == "int") {
    value = parseInt(value);
  } else if (type == "bool") {
    value = value == "true";
  } else if (type == "bool-null") {
    value = value == "null" ? null : value == "true";
  } else if (type == "date") {
    value = parseDate(value);
    value = dayjs(value).format("YYYY-MM-DD");
  } else {
    // value = value;
  }
  // console.log('handleChangeItem', field, value)

  _.set(item, field, value);

  // console.log("handleChangeItem", item);

  itemFunction?.(_.clone(item));
}

export function handleChangeItemSelect(
  option,
  config,
  item,
  field,
  type = "text",
  itemFunction
) {
  let value = option.value;
  // console.log('handleChangeItemSelect', value);

  if (type == "float") {
    value = parseFloat(value);
  } else if (type == "int") {
    value = parseInt(value);
  } else if (type == "bool") {
    value = value == "true";
  } else if (type == "bool-null") {
    value = value == "null" ? null : value == "true";
  } else if (type == "date") {
    value = parseDate(value);
    value = dayjs(value).format("YYYY-MM-DD");
  } else {
    // value = value;
  }

  _.set(item, field, value);
  // console.log("handleChangeItemSelect", item);
  itemFunction?.(_.clone(item));
}

export function handleChangeItemEditor(value, item, field, itemFunction) {
  _.set(item, field, value);

  itemFunction?.(_.clone(item));
}

export function setBodyModalOpen(isOpen) {
  // вместо добавления классов, и так есть ReactModal__Body--open.
  // Т.к. открытых модалок может быть больше одной, то нельзя при закрытии одной модалки убирать класс modal-open
  // if (isOpen) {
  //   document.body.classList.add("modal-open")
  // } else {
  //   document.body.classList.remove("modal-open")
  // }
  return;
}

export function download(dataUrl, filename) {
  let a = document.createElement("a");
  a.href = dataUrl;
  a.setAttribute("download", filename);
  a.click();

  // a.remove();
}
