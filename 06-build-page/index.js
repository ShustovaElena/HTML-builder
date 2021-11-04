const path = require('path');
const fs = require('fs');

const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const projectDistPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const assetsPathCopy = path.join(__dirname,'project-dist', 'assets');
const assetsPath = path.join(__dirname,'assets');
const indexPath = path.join(__dirname, 'project-dist','index.html');
const readableStream = fs.createReadStream(templatePath, 'utf-8');
const fsPromises = fs.promises;
let template = '';

readableStream.on('data', chunk => {
    template += chunk;
    readFileInFolder();
});

fsPromises.mkdir(projectDistPath).then(function() {
    console.log('Directory created successfully');
}).catch(function() {
    console.log('Directory already exists');
});


function readFileInFolder() {
    fs.readdir(componentsPath, {withFileTypes: true}, (err, files) => {
            if (err) throw err;
        
            for (let i = 0; i < files.length; i++) {
                let componentsPathInner = path.join(componentsPath, files[i].name);
                        let ext = path.extname(componentsPathInner);
                        let elem = path.basename(componentsPathInner, ext);
                        if (ext === '.html') {
                            const readableStreamComponents = fs.createReadStream(componentsPathInner, 'utf-8');
                            readableStreamComponents.on('data', chunk => {
                                let dateComponent = '';
                                dateComponent += chunk;
                                let regexp = new RegExp(`{{${elem}}}`, "i");
                                template = template.replace(regexp, dateComponent);
                                fs.writeFile(indexPath, template, 'utf8', function (err) {
                                    if (err) return console.log(err);
                                 });
                            });
                        }
                    }
          });
}

function mergeStyles(stylesPath) {
    const stylePath = path.join(__dirname, 'project-dist', 'style.css');

    // Удаление файла BUNDLE для обновления данных в случае их добавления, удаления, изменения!
    fs.stat(stylePath, function(err, stats) {
        if (err) {
            console.log("Файл не найден, style.css будет создан");
        } else {
            fs.unlink(stylePath, err => {
                if(err) throw err;
             });
        }
       
    fs.readdir(stylesPath, {withFileTypes: true}, (err, files) => {
            if (err) throw err;
            for (let i = 0; i < files.length; i++) {
                let nameStylePathInner = path.join(stylesPath, files[i].name);
                let ext = path.extname(nameStylePathInner);
                if (ext === '.css') {
                    const readableStream = fs.createReadStream(nameStylePathInner, 'utf-8');

                    readableStream.on('data', chunk => {
                    fs.appendFile(stylePath, chunk, function (err) {
                        if (err) throw err;
                      });
                    });
                }
            }
          });
        }); 
}
mergeStyles(stylesPath);
  
function copyDir(assetsPath, assetsPathCopy) {
    fsPromises.mkdir(assetsPathCopy).then(function() {
        console.log('Directory Assets created successfully');
    }).catch(function() {
        console.log('Directory Assets already exists');
    });

fs.readdir(assetsPath, {withFileTypes: true}, (err, files) => {
    if (err) throw err;

    for (let i = 0; i < files.length; i++) {
        try {
            let assetsPathInner =  path.join(assetsPath, files[i].name);
            let assetsPathCopyInner =  path.join(assetsPathCopy, files[i].name);
            if (files[i].isDirectory()) {
                copyDir(assetsPathInner, assetsPathCopyInner);
            } else {
                fsPromises.copyFile(assetsPathInner, assetsPathCopyInner);

                // fs.readdir(assetsPathCopy, 'utf-8', (err, elements) => {
                //     if (err) throw err;
                //     let deleteFile = diff(elements, files);
                //     if (deleteFile.length != 0) {   
                //         let deleteFilePath = path.join(assetsPathCopy, deleteFile[0]);
                //         fsPromises.unlink(deleteFilePath);
                //     }
                // });
            }
        } catch {
            console.log('The file could not be copied');
        }
    }
});
}
copyDir(assetsPath, assetsPathCopy);

function diff(a, b) {
    return a.filter(function(i) {return b.indexOf(i) < 0;});
};

