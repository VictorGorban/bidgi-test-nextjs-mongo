//* секция Библиотеки c функциями
import * as React from "react";
import _ from 'lodash'
import EJSON from 'ejson'
import NextConnect from "next-connect";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import waitDB from '@root/src/middlewares/waitDB'
import withUser from '@src/middlewares/withUser'
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
import Main from '@components/exportDb/Main'
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
          <Head>
            <title>Копирование базы данных для оффлайна</title>
          </Head>

          <Main />
        </PageDataProvider>
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