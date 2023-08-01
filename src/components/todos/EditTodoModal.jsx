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

export default React.forwardRef(function Component({ selectedTodo, onSaveTodo, onMarkCompleted }, elRef) {
    //* библиотеки и неизменяемые значения
    //* endof библиотеки и неизменяемые значения

    //* контекст
    //* endof контекст


    //* состояние
    const [isModalOpen, setModalOpen] = React.useState(false)
    const [isCompletedLoading, setIsCompletedLoading] = React.useState(false)
    const [isSubmitting, setSubmitting] = React.useState(false)

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
        if (!selectedTodo) return {}
        return {
            email: selectedTodo.email,
            username: selectedTodo.username,
            description: selectedTodo.description,
        }
    }

    function performReset(newValues) {
        console.log('performReset', newValues)
        setCurrent_formState(_.cloneDeep(newValues))
        reset(_.cloneDeep(newValues));
    }
    //* endof вспомогательные функции, НЕ ОБРАБОТЧИКИ


    //* обработчики
    async function handleMarkCompleted() {
        try {
            setIsCompletedLoading(true);
            await onMarkCompleted?.()
            // setModalOpen(false)
        } catch (e) {
            notifications.showSystemError(e.message)
        } finally {
            setIsCompletedLoading(false);
        }
    }

    function handleCancel() {
        setModalOpen(false)
    }

    async function handleSave() {
        try {
            setSubmitting(true);
            let objectToSend = _.cloneDeep(current_formState)

            await onSaveTodo?.(objectToSend)
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
                                Редактирование задачи {selectedTodo?.isCompleted && "(Выполнено)"} {selectedTodo?.isEdited && "(Отредактировано)"}
                            </h5>
                        </div>

                        <div className="content form d-flex flex-wrap pt-30 pb-40">
                            <Controller
                                control={control}
                                name="username"
                                rules={{
                                    required: "Поле обязательно",
                                    validate(v) {
                                        return true;
                                    }
                                }}
                                render={({ field, fieldState: { invalid, isTouched, isDirty, error }, formState }) => (
                                    <label className={`form-group w-md-50 ${invalid ? 'error' : ''}`}>
                                        <span className="label weight-600 size-14">Имя пользователя*</span>

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
                                    required: "Поле обязательно",
                                    validate(v) {
                                        if (v && !commonHelpers.validateEmail(v)) {
                                            return "Email неверного формата"
                                        }
                                        return true;
                                    }
                                }}
                                render={({ field, fieldState: { invalid, isTouched, isDirty, error }, formState }) => (
                                    <label className={`form-group w-md-50 ${invalid ? 'error' : ''}`}>
                                        <span className="label weight-600 size-14">Email*</span>

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
                                name="description"
                                rules={{
                                    required: "Поле обязательно",
                                    validate(v) {
                                        return true;
                                    }
                                }}
                                render={({ field, fieldState: { invalid, isTouched, isDirty, error }, formState }) => (
                                    <label className={`form-group w-md-50 ${invalid ? 'error' : ''}`}>
                                        <span className="label weight-600 size-14">Текст задачи*</span>

                                        <div className="input-wrapper">
                                            <textarea
                                                {...field}
                                                value={field.value || ''}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    clientHelpers.handleChangeItem(e, current_formState, 'description');
                                                }}
                                                type="text"
                                                maxLength="500"
                                                className="form-control textarea"
                                                placeholder=""
                                                rows="3"
                                            />
                                        </div>
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
                                <button
                                    type="button"
                                    className={`btn style-2 mx-10 py-20 px-30 color-white size-16 weight-500 ${isCompletedLoading ? 'loading' : ''}`}
                                    onClick={handleMarkCompleted}
                                    disabled={isCompletedLoading || selectedTodo?.isCompleted}
                                >
                                    <i className="fa fa-check mr-05"></i>
                                    Отметить как выполненное <div className="loader lds-ring color-brand1">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </button>
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