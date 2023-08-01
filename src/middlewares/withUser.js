//* секция Библиотеки c функциями
import { getCookies, getCookie, setCookie, removeCookies } from "cookies-next";
import _ from "lodash";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import * as Collections from "@src/ORM/Collections";
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

export default async function (req, res, next) {
  let cookies = getCookies({ req, res });
  let { user_id, token } = req.body?.auth || {};

  if (!user_id && !token) {
    ({ user_id, token } = cookies);
  }

  // console.log("withUser, body", req.body, user_id, token);

  if (user_id && token) {
    let foundUser = await Collections.users.findOne({
      _id: user_id,
      loginTokens: token,
    });
    if (foundUser) {
      let userData = foundUser;
      delete userData.password;
      req.user = userData || null;
    }
  } else {
    //Если пользователь не авторизован, то в getServerSideProps req.user == undefined и EJSON не может его сериализовать
    req.user = null;
  }

  delete req.body?.auth;

  next();
}
