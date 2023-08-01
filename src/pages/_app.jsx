//* секция Библиотеки c функциями
import * as React from "react";
import nProgress from "nprogress";
// import "nprogress/nprogress.css"
import { Router } from "next/router";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
import Head from 'next/head'
import Script from 'next/script'

//* endof  Компоненты из библиотек

//* секция Наши компоненты
import Layout from '@components/_global/Layout'
//* endof  Наши компоненты

//* секция Стили
// стили через import триггерят обновление fast-refresh, а то что в Head - нет. 
// К тому стили через import в продакшене минифицируются и объединяются в один файл.
import 'tippy.js/dist/tippy.css'; // стили из либ должны перезаписываться нашими. Поэтому либы ставить перед index.scss, а не после.
import 'react-date-range/dist/styles.css'; // main css file
// import 'react-date-range/dist/theme/default.css'; // theme css file

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'font-awesome/css/font-awesome.min.css';

import '@assets/scss/index.scss'
//* endof Стили

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

export default function MyApp({ Component, pageProps }) {

    // console.log('app, pageProps', Object.keys(pageProps))

    // todo сделать разные layout, для клиента и для админа. Для клиента нет логина, для админа есть. Или не стоит?
    return <div className="bg-gray5">
        <Head>
            <title>Название фирмы</title>
        </Head>

        <Layout {...pageProps}>
            <Component {...pageProps} />
        </Layout>

    </div>
}

