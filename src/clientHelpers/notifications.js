//* секция Библиотеки c функциями
import { toast } from "react-toastify";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты


let lastSuccess, lastInfo, lastSystemError, lastUserError;

export function showSuccess(text, options = {}) {
  lastSuccess = toast.success(text, { autoClose: 3000, ...options });
}

export function showInfo(text, options = {}) {
  lastInfo = toast.info(text, { autoClose: 4000, ...options });
}

export function showSystemError(text, options = {}) {
  // если ошибка - это прерванный запрос из-за закрытия модалки, например. При прерывании из-за таймаута будет другое сообщение
  if (text == "Request canceled") return;
  lastSystemError = toast.error(text, { autoClose: 10000, ...options });
}

export function showUserError(text, options = {}) {
  lastUserError = toast.warning(text, { autoClose: 5000, ...options });
}
