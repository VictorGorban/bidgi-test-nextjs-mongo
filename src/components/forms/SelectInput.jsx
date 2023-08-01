//* секция Библиотеки c функциями
import React from "react";
import AsyncSelect from "react-select/async";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты
export default function SelectInput({ value, options, ...otherProps }) {

    //* секция глобальное состояние из context
    //* endof глобальное состояние из context


    //* секция состояние

    // let [formattedOptions, setFormattedOptions] = React.useState([]);

    //* endof состояние


    //* секция вычисляемые переменные, изменение состояния

    let formattedOptions = formatOptions(options)

    //* endof вычисляемые переменные, изменение состояния


    //* секция эффекты

    // useEffect(() => {
    //     setFormattedOptions(formatOptions(options))
    // }, [options]) 

    //* endof эффекты


    //* секция вспомогательные функции, НЕ ОБРАБОТЧИКИ

    function formatOptions(options) {
        options = options || []
        if (!options.length) return options
        if (typeof options[0] == 'object') return options

        function capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        // если это [string, int и т.п.], то преобразуем options в формат [{label, value}]
        options = options.map(option => ({ value: option, label: capitalizeFirstLetter('' + option) }))

        return options;
    }

    //* endof вспомогательные функции, НЕ ОБРАБОТЧИКИ


    //* секция обработчики
    //* endof обработчики


    return (
        <AsyncSelect
            value={formattedOptions.find(sfs => sfs.value == value) || null}
            noOptionsMessage={() => 'Ничего не найдено...'}
            loadOptions={(inputValue, callback) => {
                callback(formattedOptions.filter(x => x.label.toLowerCase().includes(inputValue.toLowerCase())).slice(0, 50))
            }}
            defaultOptions={formattedOptions.slice(0, 50)}
            isSearchable={formattedOptions.length > 7}
            className="w-100"
            classNamePrefix="react-select"
            styles={{ menuPortal: base => ({ ...base, zIndex: 10 }) }}
            // menuPortalTarget={document.body}
            menuShouldScrollIntoView={true}
            menuPlacement="auto"
            {...otherProps}
            placeholder="Выбрать..."
        />
    )
}