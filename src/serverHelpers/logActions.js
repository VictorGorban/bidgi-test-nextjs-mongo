//* секция Библиотеки c функциями
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

const logLevels = {
  DBError: true,
  DBAction: false, // мешает!
  ServerError: true,
  UserError: true,
  Action: false,
};

function performLog({ type, message, params, args }) {
  if (typeof params == "string") params = JSON.parse(params);
  // логи можно посмотреть через pm2 logs <service_name>
  if (type.toLowerCase().includes("error")) {
    console.error({ type, message, params, args });
  } else {
    console.log({ type, message, params, args });
  }
}

function logDBError(message, params, args) {
  if (!logLevels["DBError"]) return;
  return performLog({ type: "DBError", message, params, args });
}

function logServerError(message, params, args) {
  if (!logLevels["ServerError"]) return;
  return performLog({ type: "ServerError", message, params, args });
}

function logUserError(message, params, args) {
  if (!logLevels["UserError"]) return;
  return performLog({ type: "UserError", message, params, args });
}

function logAction(message, params) {
  if (!logLevels["Action"]) return;
  return performLog({ type: "Action", message, params });
}

function logDBAction(message, params) {
  if (!logLevels["DBAction"]) return;
  return performLog({ type: "DBAction", message, params });
}

module.exports = {
  logDBError,
  logServerError,
  logUserError,
  logAction,
  logDBAction,
};
