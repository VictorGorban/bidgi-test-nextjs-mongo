//* секция Библиотеки c функциями
import React from "react";
import EJSON from 'ejson'
import NextConnect from "next-connect";

//* endof  Библиотеки c функциями

//* секция Наши хелперы
import waitDB from '@root/src/middlewares/waitDB'
import withUser from '@src/middlewares/withUser'
import * as Collections from "@src/ORM/Collections";
import * as notifications from "@src/clientHelpers/notifications"
//* endof  Наши хелперы

//* секция Контекст и store
import { ObjectProvider as UserProvider } from '@src/providers/User'
import { ObjectProvider as GlobalsProvider } from '@src/providers/Globals'
import { ObjectProvider as PageDataProvider } from '@src/providers/PageData'
//* endof  Контекст и store

//* секция Компоненты из библиотек
import Head from 'next/head'
import { useRouter } from 'next/router';
import Link from 'next/link';

//* endof  Компоненты из библиотек

//* секция Наши компоненты
import Navbar from '@components/_global/Navbar'
import LoginBlock from '@components/login_and_register/tabs/Login'

//* endof  Наши компоненты



export default function Register(params) {
  //* секция глобальное состояние из context

  //* endof глобальное состояние из context

  //* секция состояние
  const router = useRouter();
  let user = React.useMemo(() => EJSON.parse(params.user), [router.query])
  let globals = React.useMemo(() => EJSON.parse(params.globalSettings || '{}'), [router.query])
  let pageData = React.useMemo(() => EJSON.parse(params.pageData || '{}'), [router.query])
  //* endof состояние


  //* секция вычисляемые переменные, изменение состояния
  //* endof вычисляемые переменные, изменение состояния

  //* секция эффекты

  //* endof эффекты

  //* секция вспомогательные функции, НЕ ОБРАБОТЧИКИ
  //* endof вспомогательные функции, НЕ ОБРАБОТЧИКИ

  //* секция обработчики

  //* endof обработчики


  return (
    <>
      <UserProvider initValue={user}>
        <GlobalsProvider initValue={globals}>
          <PageDataProvider initValue={pageData}>
            <Navbar />

            <div className="w-100 pb-20 px-20">
              <Head>
                <title>Главная</title>
              </Head>

              <div className="login-block mx-auto my-60">
                <h1 className="heading welcome align-center mb-60">
                  <span>Главная страница. Здесь сейчас не выводится никакой информации. Поэтому вы можете открыть боковую панель слева, и перейти в нужный вам раздел.</span>
                </h1>
                <div className="d-flex justify-content-center">
                  <p className="subheading size-16 mb-60">
                    Или войти в систему:&nbsp;
                    <Link href="/login">
                      <a className="btn style-1 link">
                        Логин
                      </a>
                    </Link>
                  </p>
                </div>

              </div>

            </div>
          </PageDataProvider>
        </GlobalsProvider>
      </UserProvider>
    </>
  )
}

export async function getServerSideProps({ req, res }) {
  const middlewares = NextConnect().use(waitDB).use(withUser)
  await middlewares.run(req, res);

  let propUser = req.user || null;

  return {
    props: {
      user: EJSON.stringify(propUser),
    }
  }
}