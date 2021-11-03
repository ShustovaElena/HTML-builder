const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const namePath = path.join(__dirname, 'styles');


function mergeStyles(namePath) {
    const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

    // Удаление файла BUNDLE для обновления данных в случае их добавления, удаления, изменения!
    fs.stat(bundlePath, function(err, stats) {
        if (err) {
            console.log("Файл не найден, bundle.css будет создан");
        } else {
            fs.unlink(bundlePath, err => {
                if(err) throw err;
             });
        }
       
    fs.readdir(namePath, {withFileTypes: true}, (err, files) => {
            if (err) throw err;
            for (let i = 0; i < files.length; i++) {
                let namePathInner = path.join(namePath, files[i].name);
                let ext = path.extname(namePathInner);
                if (ext === '.css') {
                    const readableStream = fs.createReadStream(namePathInner, 'utf-8');

                    readableStream.on('data', chunk => {
                    fs.appendFile(bundlePath, chunk, function (err) {
                        if (err) throw err;
                      });
                    });
                }
            }
          });
        }); 
}
mergeStyles(namePath);
