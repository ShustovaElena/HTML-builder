const fs = require('fs');
const path = require('path');

const namePath = path.join(__dirname, 'secret-folder');

function readFileInFolder(namePath) {
    fs.readdir(namePath, {withFileTypes: true}, (err, files) => {
            if (err) throw err;
        
            for (let i = 0; i < files.length; i++) {
                let namePathInner = path.join(namePath, files[i].name);
                
                if (!(files[i].isDirectory())) {
                        let ext = path.extname(namePathInner);
                        let elem = path.basename(namePathInner, ext);

                        fs.stat(namePathInner, (err, stats) => {
                            if (err) throw err;
                            let sizeFile = `${((stats.size)/1024).toFixed(3)}kb`;
                            console.log(`${elem} - ${ext} - ${sizeFile}`)
                        });
                    }
            }
          });
}
readFileInFolder(namePath);

