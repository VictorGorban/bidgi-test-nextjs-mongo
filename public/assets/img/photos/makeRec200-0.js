// пройтись по всем вложенным папкам
// если существует rec200-0.jpg, уйти.
// если не существует, то найти rec200-{number}.jpg
// если не нашли, уйти.
// если нашли, сделать из него rec200-0.jpg

let fs = require("fs");
let path = require("path");

async function walk(dir) {
  let files = await fs.promises.readdir(dir);
  files = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file);
      const stats = await fs.promises.stat(filePath);
      if (stats.isDirectory()) return walk(filePath);
      else if (stats.isFile()) return filePath;
    })
  );

  return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

(async function a() {
  try {
    let dirFiles = await walk(__dirname);
    // console.log(dirFiles);
    for(let filePath of dirFiles){
        if(/rec200-\d\.jpg/.test(filePath)){
            // let dirname = path.dir(filePath);
            try{
            await fs.promises.access(filePath.replace(/rec200-\d/, 'rec200-0'))
            continue;
            }catch(e){
                console.log(filePath) // в той папке нет rec200-0.jpg
                await fs.promises.rename(filePath, filePath.replace(/rec200-\d/, 'rec200-0'))
            }
        }
        if(/rec200-x\.jpg/.test(filePath)){
            // let dirname = path.dir(filePath);
            try{
            await fs.promises.access(filePath.replace(/rec200-x/, 'rec200-0'))
            continue;
            }catch(e){
                console.log(filePath) // в той папке нет rec200-0.jpg
                await fs.promises.rename(filePath, filePath.replace(/rec200-x/, 'rec200-0'))
            }
        }
    }
  } catch (e) {
    console.error(e);
  }
})()
