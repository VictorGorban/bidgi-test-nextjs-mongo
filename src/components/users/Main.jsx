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
import EditUserModal from '@components/users/EditUserModal'
import CreateUserModal from '@components/users/CreateUserModal'
import TemplateTable from '@components/_global/TemplateTable'
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
    let [selectedUser, setSelectedUser] = React.useState(null)
    let [newUser, setNewUser] = React.useState(null)
    const [selectedUserRole, setSelectedUserRole] = React.useState('')

    const editUserModalRef = React.useRef();
    const createUserModalRef = React.useRef();
    //* endof состояние

    //* вычисляемые переменные, изменение состояния
    let users = pageData.users;

    let filteredUsers = users;
    if (selectedUserRole) {
        filteredUsers = filteredUsers.filter(user => user.roles?.includes(selectedUserRole))
    }

    let roles = [
        "admin",
        "Работник",
    ];
    let rolesForSelect = roles.map(role => ({ value: role, label: role }))
    rolesForSelect.unshift({ value: '', label: 'Все' })
    //* endof вычисляемые переменные, изменение состояния

    //* эффекты

    //* endof эффекты

    //* вспомогательные функции, НЕ ОБРАБОТЧИКИ

    //* endof вспомогательные функции, НЕ ОБРАБОТЧИКИ


    //* обработчики
    async function handleSelectNewUser(user) {
        setNewUser(user)

        createUserModalRef.current.setModalOpen(true)
        // в случае с модалкой тут просто: привязать обработчик архивации, показать модалку с selectedUser. Я считаю, отдельную страницу для этого делать может быть непрактично и слишком широко (данных нет толком), если только в случае статистики по рыбе.
    }

    async function handleSelectUser(user) {
        try {

            selectedUser = user;
            setSelectedUser(user)

            if (!user) return;

            editUserModalRef.current.setModalOpen(true)
        } catch (e) {
            console.error(e);
            notifications.showSystemError(e.message)
        }
    }

    async function handleSaveUser(fields) {
        try {
            let fieldsToSave = {}

            for (let key of Object.keys(fields)) {
                if (!_.isEqual(selectedUser[key], fields[key])) { fieldsToSave[key] = fields[key]; }
            }

            for (let key of Object.keys(fieldsToSave)) {
                selectedUser[key] = fieldsToSave[key];
            }

            await clientHelpers.submitObject('/api/user/update', { ...fieldsToSave, _id: selectedUser._id })

            ReactDOM.unstable_batchedUpdates(() => {
                setSelectedUser(_.clone(selectedUser))
                pageData.users = _.clone(users);
                pageDataApi.applyChanges();
            })

            notifications.showSuccess('Пользователь обновлен')
        } catch (e) {
            notifications.showSystemError(e.message)
        }
    }

    async function handleCreateUser(userFields) {
        try {
            let createdUser = await clientHelpers.submitObject('/api/user/registerUser', userFields)
            users.unshift(createdUser)
            pageData.users = _.clone(users);
            pageDataApi.applyChanges();
            notifications.showSuccess('Пользователь создан')
        } catch (e) {
            notifications.showSystemError(e.message)
        }
    }
    //* endof обработчики

    //* данные для TemplateTable
    let tableHeaders = [
        {
            key: "_id",
            isSortable: true,
            title: "_id",
            isDefaultSort: true,
            defaultDirection: 'asc',

        },
        {
            key: "name",
            isSortable: true,
            title: "Имя"

        },
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
            key: "roles",
            isSortable: false,
            title: "Роли"
        },
    ];

    let tableFields = React.useMemo(() => [
        {
            render: (item, idx) =>
                <td className="td name">
                    <span className="link"
                        onClick={e => handleSelectUser(item)}>
                        {item._id}
                    </span>
                </td>
        },
        {
            render: (item, idx) =>
                <td className="td name">
                    {item.name}
                </td>
        },
        {
            render: (item, idx) =>
                <td className="td name">
                    {item.username}
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
                    {item.roles ? item.roles.join(', ') : ''}
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
                            <h2 className="weight-400 size-21">Пользователи ({users.length})</h2>

                            <div className="actions d-flex">
                                <div className="btn style-2 size-14 px-20" onClick={e => handleSelectNewUser({})}>
                                    <i className="fa fa-plus mr-05"></i>Добавить
                                </div>
                            </div>
                        </div>

                        <div className="w-100 bg-white py-10 px-20 d-flex flex-column align-items-center form">
                            <div className="form-group flex-row w-100 d-flex flex-wrap">
                                <div className="w-100 w-md-33 d-flex justify-content-end label align-items-center size-16 color-black weight-700">
                                    Роль:&nbsp;&nbsp;
                                </div>
                                <div className="w-100 w-md-66 d-flex justify-content-start">
                                    <AsyncSelect
                                        value={rolesForSelect.find(sfs => sfs.value == selectedUserRole) || rolesForSelect[0]}
                                        onChange={(option, config) => {
                                            setSelectedUserRole(option.value);
                                        }}
                                        noOptionsMessage={() => 'Ничего не найдено...'}
                                        loadOptions={(inputValue, callback) => {
                                            callback(rolesForSelect.filter(x => x.label.toLowerCase().includes(inputValue.toLowerCase())).slice(0, 50))
                                        }}
                                        formatOptionLabel={(option) => (
                                            <div className="">
                                                <div className="text weight-700 size-18">{option.label}</div>
                                                <div className="text weight-400 size-16">{option.description}</div>
                                            </div>
                                        )}
                                        defaultOptions={rolesForSelect.slice(0, 50)}
                                        isSearchable={rolesForSelect.length > 7}
                                        className="w-100 w-md-66"
                                        classNamePrefix="react-select"
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 10 }) }}
                                        // menuPortalTarget={document.body}
                                        // document.body в модалке плохо работает. Можно не указывать, и поставить menuPosition="fixed", так работает
                                        menuShouldScrollIntoView={true}
                                        menuPlacement="auto"
                                        menuPosition={"fixed"}
                                        placeholder="Выбрать..."
                                    />
                                </div>
                            </div>


                            <TemplateTable
                                edit={false}
                                headers={tableHeaders}
                                fields={tableFields}
                                rows={filteredUsers || []}
                                keyField="_id"
                                emptyField="_id"
                                isAddEmptyTableItem={false}
                                showByDefault={true}
                                isActions={false}
                                actions={tableActions}
                                isBatchActions={false}
                                isRefreshTable={false}
                                tableClasses="table w-100"
                                pageSizeDefault={3}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <EditUserModal selectedUser={selectedUser} onSaveUser={handleSaveUser} ref={editUserModalRef} />
            <CreateUserModal newUser={newUser} onCreateUser={handleCreateUser} ref={createUserModalRef} />
        </>
    )
}