//* секция Библиотеки c функциями
import * as React from "react";
import _ from 'lodash'
import EJSON from 'ejson'
import NextConnect from "next-connect";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import * as clientHelpers from '@src/clientHelpers'
import * as notifications from '@src/clientHelpers/notifications'
import * as Collections from "@main/ORM/Collections";
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
import Main from '@components/users/Main'
//* endof  Наши компоненты

export default function Page(params) {
  //* библиотеки и неизменяемые значения
  const router = useRouter();
  //* endof библиотеки и неизменяемые значения


  //* контекст
  let user = React.useMemo(() => EJSON.parse(params.user), [router.query])
  let pageData = React.useMemo(() => EJSON.parse(params.pageData || '{}'), [router.query])
  //* endof контекст

  //* состояние

  //* endof состояние

  //* вычисляемые переменные, изменение состояния

  //* endof вычисляемые переменные, изменение состояния

  //* эффекты

  //* endof эффекты

  //* вспомогательные функции, НЕ ОБРАБОТЧИКИ

  //* endof вспомогательные функции, НЕ ОБРАБОТЧИКИ


  //* обработчики

  //* endof обработчики

  return (
    <>
      <UserProvider initValue={user}>
        <PageDataProvider initValue={pageData}>
          <Navbar />
          <Head>
            <title>Работники компании</title>
          </Head>

          <Main />

        </PageDataProvider>
      </UserProvider>
    </>
  );
}


export async function getServerSideProps({ req, res }) {
  const middlewares = NextConnect().use(waitDB).use(withUser)
  await middlewares.run(req, res);

  let propUser = req.user || null;
  let pageData = {}

  if (!propUser?.roles?.includes('admin')) {
    return {
      redirect: {
        permanent: false,
        destination: "/not-allowed"
      }
    }
  }

  let users = await Collections.users.find({
    companyId: propUser.companyId,
  })
  users = users.filter(u=>!u.roles?.includes('globalAdmin'))
  pageData.users = users;

  return {
    props: {
      user: EJSON.stringify(propUser),
      pageData: EJSON.stringify(pageData),
    }
  }
}