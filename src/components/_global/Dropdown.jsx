//* секция Библиотеки c функциями
import React from 'react';
import Tippy from '@tippyjs/react';
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

//* секция Стили компонента
//* endof  Стили компонента


const Dropdown = ({ children, ...rest }) => (

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

    <Tippy className={'bg-white color-black weight-500 size-14 border-gray2 border-radius-6'} {...rest}>
        {/* Сначала указываются дефолтные свойства, потом {...rest}. Потому что {...rest} переписывает дефолтные свойства своими. */}
        {children}
    </Tippy>
);
Dropdown.defaultProps = {
    animation: 'fade',
    arrow: false,
    delay: 0,
    trigger: 'click',
    interactive: true,
    theme: 'light'
};

export default Dropdown;
