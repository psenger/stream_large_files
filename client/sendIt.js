const fs = require('fs'),
    path = require('path'),
    request = require('request'),
    { encryptStream, encrypt } = require('../src/utils/encrypt');

const password = process.env.PASSWORD,
    fileName = process.env.FILENAME,
    url = process.env.URL;

const readStream = fs.createReadStream(path.join(__dirname, fileName), {highWaterMark: 500});
const writeStream = request.post(url, { headers: { 'File-Name': encrypt(fileName, password)} }); // .post({ url, headers: { 'File-Name': 'foo.txt'} });

readStream.pipe(encryptStream(password)).pipe(writeStream);

let upload_progress = 0;

readStream.on("data", function (chunk) {
    upload_progress += chunk.length;
    console.log(new Date(), upload_progress);
});

readStream.on("end", function () {
    console.log('Finished');
});