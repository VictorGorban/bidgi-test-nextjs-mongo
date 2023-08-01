//* секция Библиотеки c функциями
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/future/image';
import Link from 'next/link';
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты


const Error = ({ statusCode, statusText, error }) => {

    //* секция глобальное состояние из context
    //* endof глобальное состояние из context

    //* секция состояние

    const router = useRouter();

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
        <section style={{ marginBottom: '-10px' }}>
            <div className="container-404">
                <Head>
                    <title>{`${statusCode}`}</title>
                </Head>

                <div className="mx-auto">
                    <h1 className="heading mb-40">Что-то пошло не так.</h1>
                    <h1 className="heading mb-10">Код ошибки: {statusCode}</h1>
                    <p className="subheading mb-40">Информация:</p>
                    <pre className="bg-white color-red">{error?.stack || error?.message || statusText}</pre>
                    <p className="subheading mb-60">
                        <a className="link" onClick={e => router.back() || router.push('..')}>
                            Назад
                        </a>
                    </p>

                    <div className="d-flex justify-content: center;">
                        <div className="col-12 col-md-9 col-lg-6 mx-auto mt-30 mb-100">
                            {/* <Image
                                className="image-404"
                                src="/assets/img/404-image.png"
                                alt=""
                                width={920}
                                height={390}
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
};

export default Error;

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res?.statusCode || err?.statusCode || 500;
    const statusText = res?.statusText || err?.message || 'Internal server error'
    return { statusCode, statusText, error: {message: err.message, stack: err.stack} };
};

