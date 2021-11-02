const fs = require('fs');
const path = require('path');

const namePath = path.join(__dirname, 'text.txt')
const readableStream = fs.createReadStream(namePath, 'utf-8');

let data = '';

readableStream.on('data', chunk => {
    chunk = chunk.trim();
        data += chunk;
});
readableStream.on('end', () => console.log(data));
readableStream.on('error', error => console.log('Error', error.message));
