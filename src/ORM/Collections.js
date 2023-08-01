// не могу использовать simpl-schema, т.к. выдается ошибка, про require в файле типа module. В nextjs работает, тут нет. ERR_REQUIRE_ESM: must use import to load ES Module. Указывает внутри simpl-schema на clean.js и mongo-object/index.js
// * сработало с указанием resolutions "**/mongo-object": "^2.0.0"
export { default as users } from "./Models/Users";
export { default as todos } from "./Models/Todos";