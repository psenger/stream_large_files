const fs = require('fs'),
    path = require('path'),
    request = require('request'),
    { buildCipherStream, encrypt } = require('../src/utils/cryptoWrapper');

const password = process.env.PASSWORD,
      salt = process.env.SALT,
      fileName = process.env.FILENAME,
      url = process.env.URL;

const readStream = fs.createReadStream(path.join(__dirname, fileName), {highWaterMark: 500});
const writeStream = request.post(url, { headers: { 'File-Name': encrypt(fileName, password, salt)} }); // .post({ url, headers: { 'File-Name': 'foo.txt'} });
const { cipherStream, ivStream } = buildCipherStream(password, salt);

readStream
    .pipe(cipherStream)
    .pipe(ivStream)
    .pipe(writeStream);

let upload_progress = 0;

readStream.on("data", function (chunk) {
    upload_progress += chunk.length;
    console.log(new Date(), upload_progress);
});

readStream.on("end", function () {
    console.log('Finished');
});