//* секция Библиотеки c функциями
import * as React from 'react';
import EJSON from 'ejson'
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
import { ToastContainer, Slide as SlideTransition } from 'react-toastify';

//* endof  Компоненты из библиотек

//* секция Наши компоненты
import Footer from './Footer'
//* endof  Наши компоненты

//* секция Стили
import 'react-toastify/dist/ReactToastify.css';
//* endof Стили


//* Layout генерится один раз при перезагрузке страницы. UserProvider тут не работает.
export default function Layout({ children, user }) {

    //* секция глобальное состояние из context
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
            <main className="d-flex">{children}</main>
            {/* <Footer /> */}

            <ToastContainer
                position="top-right"
                autoClose={5000}
                theme="colored"
                transition={SlideTransition}
                newestOnTop={true}
                closeOnClick={true}
                closeButton={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}
