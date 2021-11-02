const fs = require('fs');
const path = require('path');

const namePathCopy = path.join(__dirname,'files-copy');
const namePath = path.join(__dirname,'files');
  
function copyDir() {
const fsPromises = fs.promises;
fsPromises.mkdir(namePathCopy).then(function() {
    console.log('Directory created successfully');
}).catch(function() {
    console.log('Directory already exists');
});

fs.readdir(namePath, 'utf-8', (err, files) => {
    if (err) throw err;

    for (let i = 0; i < files.length; i++) {
        try {
            fsPromises.copyFile(path.join(namePath,files[i]), path.join(namePathCopy,files[i]));
        } catch {
            console.log('The file could not be copied');
        }
    }

    fs.readdir(namePathCopy, 'utf-8', (err, elements) => {
        if (err) throw err;
        let deleteFile = diff(elements, files);
        if (deleteFile.length != 0) {   
            let deleteFilePath = path.join(namePathCopy, deleteFile[0]);
            fsPromises.unlink(deleteFilePath);
        }
    });


});

}
copyDir();

function diff(a, b) {
    return a.filter(function(i) {return b.indexOf(i) < 0;});
};