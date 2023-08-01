//* секция Библиотеки c функциями
import React from 'react';
import _ from 'lodash';
import delay from 'delay';
import { getCookies, getCookie, setCookie, removeCookies } from 'cookies-next';
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import * as commonHelpers from '@src/commonHelpers';
import * as clientHelpers from '@src/clientHelpers';
import * as notifications from '@src/clientHelpers/notifications';
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
//* endof  Компоненты из библиотек

//* секция Наши компоненты
import PasswordInput from '@components/forms/PasswordInput';
//* endof  Наши компоненты

export default function Component() {
    //* секция глобальное состояние из context и store

    //* endof глобальное состояние из context и store

    //* секция состояние


    const router = useRouter();
    const [isSubmitting, setSubmitting] = React.useState(false);
    const [current_formState, setCurrent_formState] = React.useState({});
    const [last_formState, setLast_formState] = React.useState({});

    const {
        control,
        handleSubmit,
        reset,
        getValues,
        setError,
        clearErrors,
    } = useForm({
        mode: 'onTouched'
    });
    //* endof состояние

    //* секция вычисляемые переменные, изменение состояния
    //* endof вычисляемые переменные, изменение состояния

    //* секция эффекты

    //* endof эффекты

    //* секция вспомогательные функции, НЕ ОБРАБОТЧИКИ
    //* endof вспомогательные функции, НЕ ОБРАБОТЧИКИ

    //* секция обработчики

    async function submitForm(data, e) {
        let objectToSend = _.cloneDeep(current_formState);

        try {
            setSubmitting(true);
            let { user: loggedUser } = await clientHelpers.submitObject(
                '/api/user/login',
                { ...objectToSend },
            );

            notifications.showSuccess('Вы вошли в систему.')
            if (loggedUser.roles?.includes('admin')) {
                router.push('/users')
            } else { router.push('/todos') }
        } catch (e) {
            notifications.showSystemError(e.message);
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    }

    function handleFormErrors(errors, e) {
        notifications.showUserError('Сначала исправьте ошибки');
    }
    //* endof обработчики

    return (
        <div className="">
            <form noValidate className="form d-flex flex-column">
                <Controller
                    control={control}
                    name="login"
                    rules={{
                        required: 'Пожалуйста введите данные для входа',
                        validate(v) {

                            return true;
                        }
                    }}
                    render={({ field, fieldState: { invalid, isTouched, isDirty, error }, formState }) => (
                        <label className={`form-group w-md-100 ${invalid ? 'error' : ''}`}>
                            <span className="label weight-600 size-14">Имя пользователя *</span>

                            <div className="input-wrapper">
                                <input
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        clientHelpers.handleChangeItem(e, current_formState, 'login');
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
                        required: 'Пожалуйста введите пароль',
                        validate(v) {
                            if (v.length < 3) {
                                return 'Пароль должен содержать минимум 3 символа';
                            }
                            return true;
                        }
                    }}
                    render={({ field, fieldState: { invalid, isTouched, isDirty, error }, formState }) => (
                        <label className={`form-group w-md-100 ${invalid ? 'error' : ''}`}>
                            <span className="label weight-600 size-14">Пароль *</span>

                            <PasswordInput
                                {...field}
                                value={field.value || ''}
                                placeholder="Ваш пароль"
                                onChange={(e) => {
                                    field.onChange(e);
                                    clientHelpers.handleChangeItem(e, current_formState, 'password');
                                }}
                            />

                            <span className="field-error">{error?.message}</span>
                        </label>
                    )}
                />

                <div className="buttons d-flex flex-wrap">
                    <div className="wrapper w-50 d-flex justify-content-center">
                        <div
                            className={`btn style-1 w-100 ${isSubmitting ? 'loading' : ''} mt-05`}
                            disabled={isSubmitting}
                            onClick={handleSubmit(submitForm, handleFormErrors)}>
                            Войти
                            <div className="loader lds-ring color-brand1">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>

                    <div className="wrapper w-50 d-flex justify-content-center">
                        <div className="link h-100 w-100 h-100 d-flex all-center">
                            Забыли пароль?
                        </div>
                    </div>
                </div>
            </form>

        </div>
    );
}
