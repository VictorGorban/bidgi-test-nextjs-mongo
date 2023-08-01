//* секция Библиотеки c функциями
import React from "react";
import EJSON from 'ejson'
import NextConnect from "next-connect";

//* endof  Библиотеки c функциями

//* секция Наши хелперы
import waitDB from '@root/src/middlewares/waitDB'
import withUser from '@src/middlewares/withUser'
import * as Collections from "@src/ORM/Collections";

//* endof  Наши хелперы

//* секция Контекст и store
import { ObjectProvider as UserProvider } from '@src/providers/User'
import { ObjectProvider as PageDataProvider } from '@src/providers/PageData'
//* endof  Контекст и store

//* секция Компоненты из библиотек
import Head from 'next/head'
import { useRouter } from 'next/router';

//* endof  Компоненты из библиотек

//* секция Наши компоненты
import Navbar from '@components/_global/Navbar'
import LoginBlock from '@components/login_and_register/tabs/Login'

//* endof  Наши компоненты


export default function Page(params) {
  const router = useRouter();

  //* секция глобальное состояние из context
  let user = React.useMemo(() => EJSON.parse(params.user), [router.query])
  let pageData = React.useMemo(() => EJSON.parse(params.pageData || '{}'), [router.query])
  //* endof глобальное состояние из context

  //* секция состояние
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
        <PageDataProvider initValue={pageData}>
          <Navbar />

          <div className="w-100 pb-20 px-20" style={{
            // minHeight: '100vh',
            // maxHeight: '100vh',
            // overflowY: 'scroll'
          }}>
            <Head>
              <title>Вход в систему</title>
            </Head>

            <div className="login-block mx-auto my-60">
              <h1 className="heading welcome align-center mb-30 size-32 color-gray3 weight-400">
                <span>Вход в систему</span>
              </h1>
              <div className="d-flex justify-content-center">
                <div className="w-lg-50">
                  <div className="tab-content" style={{ marginTop: '25px' }}>
                    <LoginBlock />
                  </div>
                </div>
              </div>

            </div>

          </div>
        </PageDataProvider>
      </UserProvider>
    </>
  )
}

export async function getServerSideProps({ req, res }) {
  const middlewares = NextConnect().use(waitDB).use(withUser)
  await middlewares.run(req, res);

  let propUser = req.user || null;

  let globalAdmin = await Collections.users.findOne({roles: 'globalAdmin'});
  // console.log('globalAdmin', globalAdmin)

  return {
    props: {
      user: EJSON.stringify(propUser),
    }
  }
}