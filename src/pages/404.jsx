//* секция Библиотеки c функциями
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
import { useRouter } from 'next/router'
import Link from 'next/link';
import Image from 'next/future/image';
import Head from 'next/head';
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты


const Custom404 = () => {
    //* секция глобальное состояние из context
    //* endof глобальное состояние из context

    //* секция состояние

    const router = useRouter();

    //* endof состояние


    //* секция вычисляемые переменные, изменение состояния
    const finalSlashIndex = router.asPath.lastIndexOf('/')
    const previousPath = router.asPath.slice(0, finalSlashIndex)
    //* endof вычисляемые переменные, изменение состояния

    //* секция эффекты

    //* endof эффекты

    //* секция вспомогательные функции, НЕ ОБРАБОТЧИКИ

    //* endof вспомогательные функции, НЕ ОБРАБОТЧИКИ

    //* секция обработчики

    //* endof обработчики


    return (
        <section style={{ marginBottom: '-10px' }}>
            <div className="container">
                <Head>
                    <title>404</title>
                </Head>

                <div className="mx-auto py-30 px-30 size-14">
                    <h1 className="heading mb-60">Что-то пошло не так.</h1>
                    <p className="subheading mb-60">Страница не найдена. Возможно, она была перемещена или удалена.</p>
                    <p className="subheading mb-60">
                        <a className="btn style-1 link" onClick={e => router.back()}>
                            Вернуться назад
                        </a>
                    </p>
                    <p className="subheading mb-60">
                        <Link href="/">
                            <a className="btn style-1 link">
                                Перейти на главную
                            </a>
                        </Link>
                    </p>
                    <p className="subheading mb-60">
                        <Link href="/login">
                            <a className="btn style-1 link">
                                Логин
                            </a>
                        </Link>
                    </p>

                    <div className="d-flex justify-content: center;">
                        <div className="w-100 w-md-33 w-lg-50 mx-auto mt-30 mb-100">
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
    );
};

export default Custom404;
