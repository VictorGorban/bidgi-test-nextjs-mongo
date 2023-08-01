//* секция Библиотеки c функциями
import * as React from "react";
import ReactDOM from "react-dom";
import _ from 'lodash'
import dayjs from 'dayjs'
import AsyncSelect from 'react-select/async'
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import * as commonHelpers from '@src/commonHelpers'
import * as clientHelpers from '@src/clientHelpers'
import * as notifications from '@src/clientHelpers/notifications'
//* endof  Наши хелперы

//* секция Контекст и store
import { ReactContext as UserContext } from '@src/providers/User'
import { ReactContext as PageDataContext } from '@src/providers/PageData'
//* endof  Контекст и store

//* секция Компоненты из библиотек
import Head from 'next/head'
import { useRouter } from 'next/router';

//* endof  Компоненты из библиотек

//* секция Наши компоненты
import EditTodoModal from '@components/todos/EditTodoModal'
import CreateTodoModal from '@components/todos/CreateTodoModal'
import UnarchiveModal from '@components/_global/UnarchiveModal'
import TemplateTable from '@components/_global/TemplateTable'
import SelectInput from '@components/forms/SelectInput'
//* endof  Наши компоненты

export default function Main() {
    //* библиотеки и неизменяемые значения
    const router = useRouter();
    //* endof библиотеки и неизменяемые значения


    //* контекст
    let { state: user } = React.useContext(UserContext);
    let { state: pageData, api: pageDataApi } = React.useContext(PageDataContext);
    //* endof контекст

    //* состояние
    let [selectedTodo, setSelectedTodo] = React.useState(null)
    let [newTodo, setNewTodo] = React.useState(null)

    const unarchiveModalRef = React.useRef();
    const editTodoModalRef = React.useRef();
    const createTodoModalRef = React.useRef();

    let [tableSettings, setTableSettings] = React.useState(_.pickBy(pageData, (value, key) => ['pageNumbersToShow', 'dataLength', 'firstPage', 'lastPage', 'selectedPage', 'pageRows', 'pageSize'].includes(key)))
    const [isTableRefreshing, setTableRefreshing] = React.useState(false)
    //* endof состояние

    //* вычисляемые переменные, изменение состояния
    let { pageNumbersToShow, firstPage, lastPage, selectedPage, pageRows, pageSize, dataLength } = tableSettings;

    //* endof вычисляемые переменные, изменение состояния

    //* эффекты

    //* endof эффекты

    //* вспомогательные функции, НЕ ОБРАБОТЧИКИ

    //* endof вспомогательные функции, НЕ ОБРАБОТЧИКИ


    //* обработчики
    async function handleSetPage(value) {
        tableSettings.selectedPage = value;
        await refreshTable()
    }

    async function refreshTable() {
        try {
            setTableRefreshing(true)
            let tableSettingsToSend = _.pickBy(tableSettings, (value, key) => ['filter', 'search', 'sortConfig', 'selectedPage', 'pageSize', 'isArchived', 'projection'].includes(key))
            let newTableSettings = await clientHelpers.submitObject("/api/todo/tableFilterAndSort", tableSettingsToSend);
            console.log('newTableSettings', newTableSettings);
            setTableSettings({ ...tableSettings, ...newTableSettings })

            // при обновлении внешних данных таблицы (скорее всего raws), у таблицы теряется выставленная сортировка
        } catch (e) {
            notifications.showSystemError(e.message)
        } finally {
            setTableRefreshing(false)
        }
    }

    // custom - это запрос на сервер. Серверу для удобства юзера стоит отдавать то что запрошено +100 и -100 записей. Все внешние фильтры тоже должны будут обновлять параметр isLoading
    async function handleSetPageSize(value) {
        tableSettings.pageSize = value;
        await refreshTable()
    }

    async function handleRequestsSortCustom(field, direction) {
        tableSettings.sortConfig = { field, direction };
        await refreshTable()
    }

    async function handleSelectNewTodo(todo) {
        setNewTodo(todo)

        createTodoModalRef.current.setModalOpen(true)
        // в случае с модалкой тут просто: привязать обработчик архивации, показать модалку с selectedTodo. Я считаю, отдельную страницу для этого делать может быть непрактично и слишком широко (данных нет толком), если только в случае статистики по рыбе.
    }

    async function handleSelectTodo(todo) {
        try {

            selectedTodo = todo;
            setSelectedTodo(todo)

            if (!todo) return;

            editTodoModalRef.current.setModalOpen(true)
        } catch (e) {
            console.error(e);
            notifications.showSystemError(e.message)
        }
    }

    async function handleSaveTodo(fields) {
        try {
            let fieldsToSave = {}

            for (let key of Object.keys(fields)) {
                if (!_.isEqual(selectedTodo[key], fields[key])) { fieldsToSave[key] = fields[key]; }
            }

            // selectedTodo это тот же объект что и в списке todo. Поэтому его изменение - это изменение объекта в списке todo.
            for (let key of Object.keys(fieldsToSave)) {
                selectedTodo[key] = fieldsToSave[key];
            }

            let updatedTodo = await clientHelpers.submitObject('/api/todo/update', { ...fieldsToSave, _id: selectedTodo._id })
            await refreshTable();

            notifications.showSuccess('Задача обновлена')
        } catch (e) {
            notifications.showSystemError(e.message)
        }
    }

    async function handleMarkCompleted() {
        try {
            await clientHelpers.submitObject('/api/todo/markCompleted', { todoId: selectedTodo._id })
            await refreshTable();

            notifications.showSuccess('Задача обновлена')
        } catch (e) {
            notifications.showSystemError(e.message)
        }
    }

    async function handleCreateTodo(todoFields) {
        try {
            await clientHelpers.submitObject('/api/todo/create', todoFields)
            await refreshTable();
            notifications.showSuccess('Задача создана')
        } catch (e) {
            notifications.showSystemError(e.message)
        }
    }
    //* endof обработчики

    //* данные для TemplateTable
    let tableHeaders = [
        {
            key: "username",
            isSortable: true,
            title: "Имя пользователя"
        },
        {
            key: "email",
            isSortable: true,
            title: "Email"
        },
        {
            key: "isCompleted",
            isSortable: true,
            title: "Статус (завершено/создано)"
        },
        {
            key: "description",
            isSortable: true,
            title: "Текст задачи"
        },
    ];

    let tableFields = React.useMemo(() => [
        {
            render: (item, idx) =>
                <td className="td name">
                    <span className="link"
                        onClick={e => handleSelectTodo(item)}>
                        {item.username || 'Не указан'}
                    </span>
                </td>
        },
        {
            render: (item, idx) =>
                <td className="td name">
                    {item.email}
                </td>
        },
        {
            render: (item, idx) =>
                <td className="td name">
                    {item.isCompleted ? "Завершено" : "Создано"}
                </td>
        },
        {
            render: (item, idx) =>
                <td className="td name">
                    {item.isEdited && "(Ред.) "}{item.description}
                </td>
        },
    ], [])

    let tableActions = React.useMemo(() => function (row, idx) {
        return (
            <>
            </>
        );
    }, [])
    //* endof данные для TemplateTable

    return (
        <>
            <div className="w-100 pb-20 px-20" style={{

            }}>
                <div className="d-flex justify-content-between w-100 w-100">
                    <div className="w-100 pt-20 d-flex flex-column align-items-center form">
                        <div className="page-header w-100 mb-20 d-flex justify-content-between color-gray3 ">
                            <h2 className="weight-400 size-21">Todos ({dataLength})</h2>

                            <div className="actions d-flex">
                                <div className="btn style-2 size-14 px-20" onClick={e => handleSelectNewTodo({})}>
                                    <i className="fa fa-plus mr-05"></i>Добавить
                                </div>
                            </div>
                        </div>

                        <div className="w-100 bg-white py-10 px-20 d-flex flex-column align-items-center form">

                            <TemplateTable
                                edit={false}
                                headers={tableHeaders}
                                fields={tableFields}
                                rows={pageRows || []}
                                // selectedRows={selectedRows}
                                // setSelectedRows={setSelectedRows}
                                keyField="_id"
                                emptyField="_id"
                                isAddEmptyTableItem={false}
                                showByDefault={true}
                                isActions={false}
                                actions={tableActions}
                                isBatchActions={false}
                                isRefreshTable={false}
                                isCustomSort={true}
                                requestSortCustom={handleRequestsSortCustom}
                                tableClasses="table w-100"
                                pageSizeDefault={999} // контролируем все из этого компонента
                                isTopPages={false}
                                isBottomPages={false}
                            />

                            {/* пагинация */}
                            <div className={`w-100 mt-10 d-flex justify-content-center justify-content-lg-end align-items-center`}>
                                <div className={`w-100 w-lg-50 d-flex flex-wrap justify-content-center justify-content-lg-end table-pagination numbers `}>
                                    <span className={`item bordered ${selectedPage == firstPage && 'disabled'}`} disabled={isTableRefreshing} onClick={() => handleSetPage(selectedPage - 1)}>
                                        &#60;
                                    </span>

                                    {/* {(lastPage >= 5)+''}{(selectedPage >= firstPage + 3)+''}{selectedPage} */}
                                    {lastPage >= 5 && selectedPage >= firstPage + 3 &&
                                        <>
                                            <span className={`item ${selectedPage == firstPage && 'disabled'}`} disabled={isTableRefreshing} onClick={() => handleSetPage(firstPage)}>{firstPage}</span>
                                            {selectedPage > firstPage + 3 && <span className="item empty">...</span>}
                                        </>
                                    }
                                    {pageNumbersToShow.map(pageNumber =>
                                        <span key={pageNumber} className={`item ${selectedPage == pageNumber && 'active'}`} disabled={isTableRefreshing} onClick={() => handleSetPage(pageNumber)}>{pageNumber}</span>
                                    )}
                                    {lastPage >= 5 && selectedPage <= lastPage - 3 &&
                                        <>
                                            {selectedPage < lastPage - 3 && <span className="item empty">...</span>}
                                            <span className={`item ${selectedPage == lastPage && 'disabled'}`} disabled={isTableRefreshing} onClick={() => handleSetPage(lastPage)}>{lastPage}</span>
                                        </>
                                    }

                                    <span className={`item bordered ${selectedPage == lastPage && 'disabled'}`} disabled={isTableRefreshing} onClick={() => handleSetPage(selectedPage + 1)}>
                                        &#62;
                                    </span>

                                </div>


                                <div className="d-none d-lg-block ml-10" style={{ width: '100px' }}>
                                    <SelectInput
                                        value={pageSize}
                                        className="table-select"
                                        options={[3, 10, 15, 25, 50]}
                                        isDisabled={isTableRefreshing}
                                        onChange={(option, config) => { handleSetPageSize(option.value) }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <UnarchiveModal ref={unarchiveModalRef} />
            <EditTodoModal selectedTodo={selectedTodo} onSaveTodo={handleSaveTodo} onMarkCompleted={handleMarkCompleted} ref={editTodoModalRef} />
            <CreateTodoModal newTodo={newTodo} onCreateTodo={handleCreateTodo} ref={createTodoModalRef} />
        </>
    )
}