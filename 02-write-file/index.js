const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const namePath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(namePath);

stdout.write('Введите данные:\n');
process.on('exit', () => stdout.write('Ввод завершен!'));
stdin.on('data', data => {
    if (data.includes('exit')) {
        process.exit();
    }
    output.write(data);
});

