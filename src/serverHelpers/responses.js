//* секция Библиотеки c функциями
//* endof  Библиотеки c функциями

//* секция Наши хелперы
// import {logUserError, logAction} from './logActions'
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

export function error(res, message = 'error', data = {}, statusCode = 200) {
  if (!res) return; // для случая когда вызывается функция не юзером, а сервером
  if (res.writableEnded) return;
  console.error('Error response', message)

  return res.status(statusCode).json({
    status: 'error',
    message,
    data,
  });
}

export function success(res, message = 'success', data = {}, statusCode = 200) {
  if (!res) return; // для случая когда вызывается функция не юзером, а сервером
  if (res.writableEnded) return; // похоже что nextjs сохранил важные поля нативного res, и это хорошо.

  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
}
