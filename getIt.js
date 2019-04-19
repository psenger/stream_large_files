const fs = require('fs');
const path = require('path');
const request = require('request');

const writeStream = fs.createWriteStream(path.join(__dirname, 'read_file.tar.gz'));
const readStream = request.get('http://127.0.0.1:3000/');

readStream.pipe(writeStream);

let upload_progress = 0;

readStream.on("data", function (chunk) {
    upload_progress += chunk.length;
    console.log(new Date(), upload_progress);
});

readStream.on("end", function () {
    console.log('Finished');
});