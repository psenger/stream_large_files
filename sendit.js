const fs = require('fs');
const path = require('path');
const request = require('request');
const readStream = fs.createReadStream(path.join(__dirname, 'file.tar.gz'), {highWaterMark: 500});

const writeStream = request.post('http://127.0.0.1:3000/');

readStream.pipe(writeStream)

let upload_progress = 0;

readStream.on("data", function (chunk) {
    upload_progress += chunk.length
    console.log(new Date(), upload_progress);
});

readStream.on("end", function (res) {
    console.log('Finished');
});