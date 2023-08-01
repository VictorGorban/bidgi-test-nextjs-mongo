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
import Main from '@components/todos/Main'
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
            <title>Список задач</title>
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

  let pageSize = 3;
  let todos = await Collections.todos.find({
    companyId: propUser.companyId
  }).sort({ createdAt: -1 }).limit(pageSize)
  // записей там уже десятки тысяч, так что без серверной пагинации не обойтись.
  pageData.pageSize = pageSize;
  let allDataLength = await Collections.todos.count()

  let selectedPage = 1;
  let filteredCount = allDataLength;

  let firstPage = 1;
  let remainder = filteredCount % pageSize
  // если пагинация серверная, то firstPage, lastPage, pageNumbersToShow ставится именно там. А вообще, в случае серверной пагинации 
  // нужно просто скрыть блок пагинации, и делать все это в родительском компоненте: TemplateTable оставить только для показа строк.
  let lastPage = Math.floor(filteredCount / pageSize)
  if (remainder) lastPage++
  if (selectedPage > lastPage) selectedPage = lastPage; // такая ситуация может возникнуть при смене кол-ва строк

  let pageInterval = [(selectedPage - 1) * pageSize, selectedPage * pageSize]
  if (pageInterval[1] > filteredCount) {
    pageInterval[1] = filteredCount
  }

  let pageRows = todos

  let pageNumbersToShow = [selectedPage - 2, selectedPage - 1, selectedPage, selectedPage + 1, selectedPage + 2].filter(item => item >= firstPage && item <= lastPage)

  pageData.firstPage = firstPage;
  pageData.lastPage = lastPage;
  pageData.selectedPage = selectedPage;
  pageData.pageRows = pageRows;
  pageData.pageNumbersToShow = pageNumbersToShow;
  pageData.dataLength = allDataLength;

  return {
    props: {
      user: EJSON.stringify(propUser),
      pageData: EJSON.stringify(pageData),
    }
  }
}