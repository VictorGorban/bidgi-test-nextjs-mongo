//* секция Библиотеки c функциями
import React from 'react';
import ReactDOM from "react-dom";
import _ from 'lodash';
import AsyncSelect from 'react-select/async'

//* endof  Библиотеки c функциями

//* секция Наши хелперы
import * as commonHelpers from '@src/commonHelpers'
import * as clientHelpers from '@src/clientHelpers'
import * as notifications from '@src/clientHelpers/notifications'
//* endof  Наши хелперы

//* секция Контекст и store
import { ReactContext as UserContext } from '@src/providers/User'
//* endof  Контекст и store

//* секция Компоненты из библиотек
import { Controller, useForm } from 'react-hook-form';
import Modal from 'react-modal';
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

//* секция Стили компонента
//* endof  Стили компонента

Modal.setAppElement('#__next');

export default React.forwardRef(function Component({ selectedUser, onSaveUser, }, elRef) {
    //* библиотеки и неизменяемые значения
    //* endof библиотеки и неизменяемые значения

    //* контекст
    let { state: user } = React.useContext(UserContext)
    //* endof контекст


    //* состояние
    const [isModalOpen, setModalOpen] = React.useState(false)
    const [isSubmitting, setSubmitting] = React.useState(false)
    const [userRoles, setUserRoles] = React.useState([])

    const [current_formState, setCurrent_formState] = React.useState({});

    const {
        control,
        handleSubmit,
        reset,
    } = useForm({
        mode: 'onTouched'
    });
    //* endof состояние

    //* секция вычисляемые переменные, изменение состояния
    let roles = [
        "admin",
        "Работник",
    ];
    let rolesForSelect = roles.map(role => ({ value: role, label: role }))
    //* endof вычисляемые переменные, изменение состояния

    //* эффекты

    React.useImperativeHandle(elRef, () => ({
        setModalOpen,
    }))

    React.useEffect(() => {
        if (isModalOpen) {
            performReset(getDefaultValues());
        }
    }, [isModalOpen])

    //* endof эффекты

    //* секция вспомогательные функции, НЕ ОБРАБОТЧИКИ
    function getDefaultValues() {
        if (!selectedUser) return {}
        return {
            name: selectedUser.name,
            email: selectedUser.email,
            username: selectedUser.username,
            roles: selectedUser.roles,
        }
    }

    function performReset(newValues) {
        console.log('performReset', newValues)
        setCurrent_formState(_.cloneDeep(newValues))
        setUserRoles(_.cloneDeep(newValues.roles || []));
        reset(_.cloneDeep(newValues));
    }
    //* endof вспомогательные функции, НЕ ОБРАБОТЧИКИ


    //* обработчики
    function handleCancel() {
        setModalOpen(false)
    }

    async function handleSave() {
        try {
            setSubmitting(true);
            let objectToSend = _.cloneDeep(current_formState)

            await onSaveUser?.(objectToSend)
            // setModalOpen(false)
        } catch (e) {
            notifications.showSystemError(e.message)
        } finally {
            setSubmitting(false);
        }
    }

    //* endof обработчики

    return (
        <Modal
            isOpen={isModalOpen}
            onAfterOpen={() => clientHelpers.setBodyModalOpen(true)}
            onAfterClose={() => clientHelpers.setBodyModalOpen(false)}
            onRequestClose={handleCancel}
            overlayClassName={{
                base: 'modal-overlay-base',
                afterOpen: 'modal-overlay-after',
                beforeClose: 'modal-overlay-before'
            }}
            className={{
                base: 'modal-content-base w-100',
                afterOpen: 'modal-content-after',
                beforeClose: 'modal-content-before'
            }}
            style={{ content: { maxWidth: 1000 } }}
            closeTimeoutMS={500}
        >
            <div className="w-100 h-100 bg-brand5 p-10">
                <div className="w-100 h-100 bg-brand4 position-relative">
                    <button
                        className="btn modal-close-btn"
                        onClick={handleCancel}
                    >
                        <i className="fa fa-close size-36"></i>
                    </button>
                    <div className="bg-white px-40 py-30 border-radius-5">
                        <div className="header d-flex align-items-center justify-content-center mb-10">
                            <h5 className="modal-heading">
                                Редактирование пользователя
                            </h5>
                        </div>

                        <div className="content form d-flex flex-wrap pt-30 pb-40">
                            <Controller
                                control={control}
                                name="name"
                                rules={{
                                    required: 'Поле обязательно',
                                    validate(v) {

                                        return true;
                                    }
                                }}
                                render={({ field, fieldState: { invalid, isTouched, isDirty, error }, formState }) => (
                                    <label className={`form-group w-md-50 ${invalid ? 'error' : ''}`}>
                                        <span className="label weight-600 size-14">Имя *</span>

                                        <div className="input-wrapper">
                                            <input
                                                {...field}
                                                value={field.value || ''}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    clientHelpers.handleChangeItem(e, current_formState, 'name');
                                                }}
                                                type="text"
                                                maxLength="500"
                                                className="form-control"
                                                placeholder=""
                                            />
                                        </div>
                                        <span className="field-error">{error?.message}</span>
                                    </label>
                                )}
                            />

                            <Controller
                                control={control}
                                name="username"
                                rules={{
                                    required: 'Поле обязательно',
                                    validate(v) {

                                        return true;
                                    }
                                }}
                                render={({ field, fieldState: { invalid, isTouched, isDirty, error }, formState }) => (
                                    <label className={`form-group w-md-50 ${invalid ? 'error' : ''}`}>
                                        <span className="label weight-600 size-14">Имя пользователя *</span>

                                        <div className="input-wrapper">
                                            <input
                                                {...field}
                                                value={field.value || ''}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    clientHelpers.handleChangeItem(e, current_formState, 'username');
                                                }}
                                                type="text"
                                                maxLength="500"
                                                className="form-control"
                                                placeholder=""
                                            />
                                        </div>
                                        <span className="field-error">{error?.message}</span>
                                    </label>
                                )}
                            />

                            <Controller
                                control={control}
                                name="email"
                                rules={{
                                    validate(v) {
                                        if (v && !commonHelpers.validateEmail(v)) {
                                            return "Email неверного формата"
                                        }
                                        return true;
                                    }
                                }}
                                render={({ field, fieldState: { invalid, isTouched, isDirty, error }, formState }) => (
                                    <label className={`form-group w-md-50 ${invalid ? 'error' : ''}`}>
                                        <span className="label weight-600 size-14">Email</span>

                                        <div className="input-wrapper">
                                            <input
                                                {...field}
                                                value={field.value || ''}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    clientHelpers.handleChangeItem(e, current_formState, 'email');
                                                }}
                                                type="text"
                                                maxLength="500"
                                                className="form-control"
                                                placeholder=""
                                            />
                                        </div>
                                        <span className="field-error">{error?.message}</span>
                                    </label>
                                )}
                            />

                            <Controller
                                control={control}
                                name="password"
                                rules={{
                                    validate(v) {
                                        if (v && v.length < 3) {
                                            return 'Пароль должен содержать минимум 3 символа';
                                        }
                                        return true;
                                    }
                                }}
                                render={({ field, fieldState: { invalid, isTouched, isDirty, error }, formState }) => (
                                    <label className={`form-group w-md-50 ${invalid ? 'error' : ''}`}>
                                        <span className="label weight-600 size-14">Пароль. Введите значение чтобы сменить</span>

                                        <input
                                            {...field}
                                            value={field.value || ''}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                clientHelpers.handleChangeItem(e, current_formState, 'password');
                                            }}
                                            type="text"
                                            maxLength="500"
                                            className="form-control"
                                            placeholder=""
                                        />

                                        <span className="field-error">{error?.message}</span>
                                    </label>
                                )}
                            />

                            <Controller
                                control={control}
                                name="roles"
                                rules={{
                                    validate(v) {
                                        if (!userRoles.length) {
                                            return 'Заполните роли'
                                        }
                                        return true;
                                    }
                                }}
                                render={({ field, fieldState: { invalid, isTouched, isDirty, error }, formState }) => (
                                    <label className={`form-group w-100 ${invalid ? 'error' : ''}`}>
                                        <span className="label weight-600 size-14">Роли *</span>

                                        <AsyncSelect
                                            {...field}
                                            value={rolesForSelect.filter(obj => userRoles.includes(obj.value)) || []}
                                            onChange={(option, config) => {
                                                setUserRoles(option.map(op => op.value))
                                                current_formState.roles = option.map(op => op.value);
                                            }}
                                            isMulti
                                            noOptionsMessage={() => 'Ничего не найдено...'}
                                            loadOptions={(inputValue, callback) => {
                                                callback(rolesForSelect.filter(x => x.label.toLowerCase().includes(inputValue.toLowerCase())).slice(0, 50))
                                            }}
                                            defaultOptions={rolesForSelect.slice(0, 50)}
                                            isSearchable={rolesForSelect.length > 7}
                                            className="w-100"
                                            classNamePrefix="react-select"
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 10 }) }}
                                            // menuPortalTarget={document.body}
                                            // document.body в модалке плохо работает. Можно не указывать, и поставить menuPosition="fixed", так работает
                                            menuShouldScrollIntoView={true}
                                            menuPlacement="auto"
                                            menuPosition={"fixed"}
                                            placeholder="Выбрать..."
                                        />

                                        <span className="field-error">{error?.message}</span>
                                    </label>
                                )}
                            />

                        </div>
                        <div className="footer d-flex justify-content-between align-items-center mt-30">
                            <div>

                            </div>

                            <div>
                                <button
                                    type="button"
                                    className={`btn style-2 mx-10 py-20 px-30 color-white size-16 weight-500 ${isSubmitting ? 'loading' : ''}`}
                                    onClick={handleSubmit(handleSave)}
                                    disabled={isSubmitting}
                                >
                                    Сохранить <div className="loader lds-ring color-brand1">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </button>
                                {/* <button
                                    type="button"
                                    className={`btn style-2 mx-10 py-20 px-30 color-white size-16 weight-500 ${isQRDownloading ? 'loading' : ''}`}
                                    onClick={downloadUserQR}
                                    disabled={isQRDownloading}
                                >
                                    <i className="fa fa-qrcode mr-05"></i>
                                    Скачать QR <div className="loader lds-ring color-brand1">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </button> */}
                                <button
                                    type="button"
                                    className={`btn style-1 mx-10 py-20 px-30 size-16 weight-500`}
                                    onClick={handleCancel}
                                >
                                    Закрыть это окно
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
})