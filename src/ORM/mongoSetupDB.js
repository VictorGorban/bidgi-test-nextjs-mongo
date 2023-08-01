import * as Collections from "@src/ORM/Collections";
import { hashPassword } from "@src/serverHelpers/passwordUtil";
const MongoClient = require("mongodb").MongoClient;
const MongoAbstractCursor = require("mongodb").AbstractCursor;
import _ from "lodash";

//* Приходится глобальные вещи держать в глобальной области. Никаких конфликтов имен нет, большого кол-ва переменных тоже нет.
global.isDBInitialized = global.isDBInitialized || false;
global.isDBInitializing = global.isDBInitializing || false;
global.dbInitializingPromise = global.dbInitializingPromise || null;

{
  //* чтобы можно было писать await <cursor>.
  MongoAbstractCursor.prototype.then = function (thenCallback, errCallback) {
    return this.toArray().then(thenCallback, errCallback);
  };
  MongoAbstractCursor.prototype.projection = function (...params) {
    return this.project(...params);
  };
}

async function initializeDB() {
  let promiseResolve, promiseReject;
  try {
    global.isDBInitialized = false;
    global.isDBInitializing = true;

    global.dbInitializingPromise = new Promise((resolve, reject) => {
      [promiseResolve, promiseReject] = [resolve, reject];
    });
    let start = new Date();

    let client = await MongoClient.connect(process.env.DB_HOST);
    console.log("init db with name", process.env.DB_NAME);
    const db = client.db(process.env.DB_NAME);
    global.db = db;

    let allCollections = await db.listCollections().toArray(); // возвращает CollectionInfo[], а не сами Collection[]
    for (let collectionClass of Object.values(Collections)) {
      let collectionByName = allCollections.find(
        (col) => col.name == collectionClass.collectionName
      );
      if (!collectionByName) {
        //* createCollection в общем случае не нужна, но при необходимости настроек коллекции это все-таки нужно.
        db.createCollection(
          collectionClass.collectionName,
          collectionClass.collectionOptions
        );
      } else {
      }
      collectionClass.collection = db.collection(
        collectionClass.collectionName
      );

      for (let indexData of collectionClass.indexes) {
        await collectionClass.collection.createIndex(
          indexData.definition,
          indexData.options || undefined // undefined - симуляция вызова с 1м аргументом
        );
      }
    }

    let end = new Date();
    console.log("DB initialized", end - start);
    promiseResolve();
    global.isDBInitialized = true;

    let sampleUser = await Collections.users.findOne();
    if (!sampleUser) { // предполагаем если нет ни одного юзера, то БД пустая
      // seed
      await seedDatabase();
    }

  } catch (e) {
    promiseReject(e);
    console.error(e);
    throw e;
  } finally {
    global.isDBInitializing = false;
  }
}

export async function reinitializeDB() {
  await initializeDB();
}

export function haltDB() {
  global.isDBInitialized = false;
  global.dbInitializingPromise = delay(999_999_999); // никогда не разрешится, скорее всего
}

export async function getDBInitialized() {
  if (global.isDBInitialized) {
    return true;
  }
  if (!global.isDBInitializing) {
    await initializeDB();
    return global.isDBInitialized;
  } else {
    await global.dbInitializingPromise;
    return global.isDBInitialized;
  }

  return global.isDBInitialized;
}

global.getDBInitialized = getDBInitialized;


export async function seedDatabase() {
  let adminUser = {
    username: 'admin',
    password: await hashPassword("123"),
    name: "Админ по умолчанию",
    roles: ['admin']
  }
  await Collections.users.insertOne(adminUser)
}