//* секция Библиотеки c функциями
import * as React from "react";
import _ from 'lodash'
import { useRouter } from 'next/router'
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
import { ReactContext as GlobalsContext } from '@src/providers/Globals'
//* endof  Контекст и store

//* секция Компоненты из библиотек
import Link from 'next/link'
//* endof  Компоненты из библиотек

//* секция Виджеты
import renderWidgetBySettings from "@components/widgets/RenderBySettings"
//* endof  Виджеты

//* секция Наши компоненты
//* endof  Наши компоненты


export default function Component({ }) {
    //* секция глобальное состояние из context
    let { state: globals } = React.useContext(GlobalsContext)
    //* endof глобальное состояние из context

    //* секция состояние
    const router = useRouter();

    //* endof состояние


    //* секция вычисляемые переменные, изменение состояния
    //* endof вычисляемые переменные, изменение состояния

    //* секция эффекты

    //* endof эффекты

    //* секция вспомогательные функции, НЕ ОБРАБОТЧИКИ
    function renderFooterMenuItem(menuItem) {
        // подменю тут не будет, т.к. на мобилках дропдаун будет смотреться бредово - на мобилках должен быть collapsible
        let result = null
        result =
            <Link href="/" key={menuItem.href}>
                <a className={`nav-item ${menuItem.href ? router.pathname.startsWith(menuItem.href) : router.pathname == menuItem.href && 'active'}`}>
                    <li>
                        {menuItem.title}
                    </li>
                </a>
            </Link>

        return result;
    }
    //* endof вспомогательные функции, НЕ ОБРАБОТЧИКИ

    //* секция обработчики

    //* endof обработчики

    return (
        <>
            <footer className="w-100 bg-white pb-20 pt-05">
                <div className="w-100 bg-brand5 py-20">
                    <div className="container footer">
                        <div className="w-100 pb-20">
                            {
                                renderWidgetBySettings(globals.footer?.widget)
                            }
                        </div>

                        <ul className="menu w-100 pl-0 mb-0 pb-30 d-flex justify-content-center justify-content-lg-start flex-wrap align-center">
                            {globals.footer?.links.map(menuItem => renderFooterMenuItem(menuItem))}
                        </ul>
                        <div className="d-flex justify-content-center justify-content-lg-between align-items-start flex-wrap">
                            <div className="slogan w-100 w-md-50 w-xl-75 full-slogan pr-10">
                                {globals.fullSlogan || 'Слоган не указан'}
                            </div>

                            <div className="copyright w-100 w-md-50 w-xl-25 mt-20 mt-md-0">
                                <div>Copyright © {new Date().getFullYear()}</div>
                                <div>Разработано: <a href="http://193.234.34.54" className="link-brand">Виктор Горбань</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
