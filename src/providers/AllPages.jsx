//* секция Библиотеки c функциями
import * as React from 'react'
import _ from 'lodash'

//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

export const ReactContext = React.createContext();

export function ArrayProvider({ initValue, children }) {
  // 
  const [state, setState] = React.useState(initValue)

  React.useEffect(() => {
    setState(initValue) // если при useEffect initValue == state, то лишнего рендера не будет.
  }, [initValue])

  const api = {
    replace(newValue) {
      setState(newValue)
    },
    push(newItems) {
      let newState = [...state, ...newItems];
      setState(newState)
    },
    applyChanges() {
      let newState = _.clone(state);
      setState(newState)
    },
    reset() {
      setState(_.clone(initValue))
    },
    getState() {
      return state
    }
  }

  return <ReactContext.Provider value={{ state, api }}>
    {children}
  </ReactContext.Provider>
}

