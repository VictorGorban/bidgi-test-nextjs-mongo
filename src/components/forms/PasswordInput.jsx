//* секция Библиотеки c функциями
import React from "react";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты
export default function PasswordInput({ value, showPasswordDefault = false, ...otherProps }) {

    
    //* секция глобальное состояние из context
    //* endof глобальное состояние из context
    
    //* секция состояние

    const [showPassword, setShowPassword] = React.useState(showPasswordDefault)
    
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
        <div className="input-wrapper">
            <input type={showPassword ? 'text' : 'password'} className="form-control pl-10" {...otherProps} />
            <div className="text-badge bg-green show-password" onClick={e => setShowPassword(true)}>Показать</div>
            <div className="text-badge bg-green hide-password" onClick={e => setShowPassword(false)}>Скрыть</div>
        </div>
    )
}