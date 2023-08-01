//* секция Библиотеки c функциями
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
import Document, { Html, Head, Main, NextScript } from 'next/document'
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты


export default function CustomDocument() {
    // console.log('document lang', lang)
    // console.log('custom document lang', lang)
    return (
        // <Html lang={lang}>
        <Html>
            <Head>
                <link rel="shortcut icon" href="/favicon.png" type="image/png" />
                {/* <meta name="google-site-verification" content="Nxc8ykwi5uqzhnklBAWCnohj_53dlgXe1vVeN8sulus" /> */}


                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

                {/* <link
                    href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap"
                    rel="stylesheet" /> */}


            </Head>
            <body>
                <Main />
                <NextScript />

                {/* <YMInitializer
                    accounts={[73762570]}
                    options={{
                        clickmap: true,
                        trackLinks: true,
                        accurateTrackBounce: true
                    }}
                /> */}
            </body>
        </Html>
    )
}

// CustomDocument.getInitialProps = async function (ctx) {
//     const initialProps = await Document.getInitialProps(ctx);
//     const { asPath } = ctx;
//     const lang = asPath.startsWith("/ua") ? "ua" : "ru";
//     console.log('getInitialProps, lang', lang, asPath)
//     return { ...initialProps, lang };
// }