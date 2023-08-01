//* секция Библиотеки c функциями
import React from 'react';
import _ from 'lodash';
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import * as commonHelpers from '@src/commonHelpers'
import * as clientHelpers from '@src/clientHelpers'

//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
import Modal from 'react-modal';
//* endof  Компоненты из библиотек

//* секция Наши компоненты

//* endof  Наши компоненты

//* секция Стили компонента
//* endof  Стили компонента

Modal.setAppElement('#__next');

export default React.forwardRef(function Component({ objectName }, elRef) {

    //* секция глобальное состояние из context
    //* endof глобальное состояние из context

    //* секция состояние
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [promiseActions, setPromiseActions] = React.useState(null);

    //* endof состояние


    //* секция вычисляемые переменные, изменение состояния
    //* endof вычисляемые переменные, изменение состояния

    //* секция эффекты
    React.useImperativeHandle(elRef, () => ({
        setModalOpen,
        setPromiseActions,
    }))

    //* endof эффекты

    //* секция вспомогательные функции, НЕ ОБРАБОТЧИКИ

    //* endof вспомогательные функции, НЕ ОБРАБОТЧИКИ

    //* секция обработчики
    function handleYes() {
        promiseActions.resolve(true)
        setModalOpen(false);
    }

    function handleNo() {
        promiseActions.resolve(false)
        setModalOpen(false);
    }

    //* endof обработчики
    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onAfterOpen={() => clientHelpers.setBodyModalOpen(true)}
                onAfterClose={() => clientHelpers.setBodyModalOpen(false)}
                onRequestClose={handleNo}
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
                closeTimeoutMS={500}
            >
                <div className="w-100 h-100 bg-brand5 p-10">
                    <div className="w-100 h-100 bg-white position-relative">
                        <button
                            className="btn modal-close-btn"
                            onClick={handleNo}
                        >
                            <i className="fa fa-close size-48"></i>
                        </button>
                        <div className="bg-white px-40 py-30 border-radius-5">
                            <div className="header d-flex align-items-center justify-content-center mb-10">
                                <h5 className="modal-heading">Объект архивирован: {objectName}</h5>
                            </div>
                            <div className="content form w-100 d-flex justify-content-center flex-wrap mt-10">
                                <p className="size-20">Этот объект архивирован. Работа с ним не может быть продолжена до отмены архивации. Отменить архивацию?</p>
                            </div>

                            <div className="footer d-flex justify-content-center align-items-center mt-30">
                                <button
                                    type="button"
                                    className={`btn style-2 mx-10 py-20 px-30 color-white size-16 weight-500`}
                                    onClick={handleYes}
                                >
                                    Отменить архивацию
                                </button>

                                <button
                                    type="button"
                                    className={`btn style-1 mx-10 py-20 px-30 color-white size-16 weight-500`}
                                    onClick={handleNo}
                                >
                                    Закрыть это окно
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
})