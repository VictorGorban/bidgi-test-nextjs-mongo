//* секция Библиотеки c функциями
import * as React from "react";
import _ from 'lodash'
import { useRouter } from 'next/router'
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import * as clientHelpers from '@src/clientHelpers'
import * as notifications from '@src/clientHelpers/notifications'
//* endof  Наши хелперы

//* секция Контекст и store
import { ReactContext as UserContext } from '@src/providers/User'
//* endof  Контекст и store

//* секция Компоненты из библиотек
import Link from 'next/link'
//* endof  Компоненты из библиотек

//* секция Виджеты
//* endof  Виджеты

//* секция Наши компоненты
//* endof  Наши компоненты


export default function Component({ }) {
    //* секция глобальное состояние из context
    let { state: user, api: userApi } = React.useContext(UserContext)
    //* endof глобальное состояние из context

    //* секция состояние
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = React.useState(false)

    //* endof состояние


    //* секция вычисляемые переменные, изменение состояния
    //* endof вычисляемые переменные, изменение состояния

    //* секция эффекты

    React.useEffect(() => {
        setSidebarOpen(true)
        document.body.classList.add('sidebar-open')
    }, [router.pathname])

    //* endof эффекты

    //* секция вспомогательные функции, НЕ ОБРАБОТЧИКИ
    function hideSidebar(e) {
        e?.preventDefault();
        setSidebarOpen(false)
        document.body.classList.remove('sidebar-open')
    }

    //* endof вспомогательные функции, НЕ ОБРАБОТЧИКИ

    //* секция обработчики
    function openSidebar(e) {
        e?.preventDefault();
        setSidebarOpen(true)
        document.body.classList.add('sidebar-open')
    }

    function toggleSidebar(e) {
        e?.preventDefault();
        isSidebarOpen ? hideSidebar(e) : openSidebar(e)
    }

    async function logout(e) {
        e?.preventDefault();
        try {
            let result = await clientHelpers.submitObject(
                '/api/user/logout',
                {},
            );

            notifications.showSuccess('Вы вышли из системы.')
            router.push('/login')
        } catch (e) {
            notifications.showSystemError(e.message);
            console.error(e);
        } finally {
        }
    }

    //* endof обработчики

    return (
        <>
            <nav
                className={`navbar p-0`}
            >
                {/* Блок правого меню, который выезжает при клике на кнопку меню */}
                <div id="rightNav" className={`right-menu-wrapper d-flex ${isSidebarOpen && 'open'}`}
                >
                    <div className="menu bg-brand1 d-flex flex-column px-0 py-20"
                    >
                        <ul className="pl-0 navbar-nav flex-grow-1">
                            {user?.roles?.includes('admin') ?
                                <Link
                                    href={'/users'}>
                                    <a className={`link nav-item ${router.pathname.startsWith('/') && 'active'}`}>
                                        <li>
                                            <i className="fa fa-user size-18 mr-10">
                                            </i>
                                            Пользователи
                                        </li>
                                    </a>
                                </Link>
                                : null
                            }
                            <Link
                                href={'/todos'}>
                                <a className={`link nav-item ${router.pathname.startsWith('/todos') && 'active'}`}>
                                    <li>
                                        <i className="fa fa-check size-18 mr-10">
                                        </i>
                                        Todo-список
                                    </li>
                                </a>
                            </Link>
                        </ul>

                        {user ?
                            <div className="company-block w-100 d-flex px-20 color-white">
                                <div className="image user-image d-flex all-center">
                                    <i className="fa fa-user size-30"></i>
                                </div>
                                <div className="links d-flex flex-column justify-content-center">
                                    <div className="name mb-05">{user?.name || user?.username}</div>
                                    <div>
                                        <span className="link ml-20" onClick={logout}><i className="fa fa-sign-out mr-05"></i>Выйти</span>
                                    </div>
                                </div>
                            </div>
                            : null
                        }
                    </div>

                    {/* Кнопка которая открывает боковое меню на мобилках и планшетах */}
                    <div className="btn rightbar-toggler d-flex flex-column justify-content-center h-100 color-gray3" onClick={toggleSidebar}>
                        <i className="fa fa-angle-left mb-30 size-34" alt="" />
                        <i className="fa fa-angle-left mt-30 size-34" alt="" />
                    </div>
                </div>
            </nav >

        </>
    )
}
