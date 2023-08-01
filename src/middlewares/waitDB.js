//* секция Библиотеки c функциями
import fs from 'fs'
import path from 'path'
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import { getDBInitialized } from "@src/ORM/mongoSetupDB";
// пора вводить логику prepared
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

// тут лучше чтобы была подготовка БД, хотя бы чтобы были все страницы из БД наготове, и таким образом даже кэширование было мгновенным.
export default async function (req, res, next) {
  await getDBInitialized();

  next()
}

setIntervalAndExecute(async function () {
  await walkDir(process.env.PUBLIC_TEMP_DIR, function (filePath) {
    fs.stat(filePath, async function (err, stat) {
      let now = new Date().getTime();
      let endTime = new Date(stat.mtime).getTime() + 1_800_000; // 30 минут в миллисекундах

      if (err) {
        return console.error(err);
      }

      if (now > endTime) {
        // console.log("must unlink ", filePath);
        return await fs.promises.rm(filePath, { recursive: true });
      }
    });
  });
}, 3600000); // каждый час

async function walkDir(dir, callback) {
  let files = [];
  try {
    await fs.promises.mkdir(dir, { recursive: true });
    files = await fs.promises.readdir(dir);
  } catch (e) {
    console.error("readdir error", dir, e.message);
    return files;
  }

  files.forEach(async (file) => {
    let dirPath = path.join(dir, file);
    let isDirectory = await fs.promises.stat(dirPath);
    isDirectory = isDirectory.isDirectory();
    callback(path.join(dir, file)); // временные папки тоже удалять нужно. А то будет миллион папок пустых
    // isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, file));
  });
}

async function setIntervalAndExecute(fn, t) {
  // Error в асинхронной функции в setImmediate или setInterval крашит приложение
  // setImmediate(fn)
  await fn();
  return setInterval(fn, t);
}
