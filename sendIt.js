const fs = require('fs'),
    path = require('path'),
    request = require('request'),
    crypto = require('crypto');

const algorithm = 'aes-256-cbc',
    password = process.env.PASSWORD, // 32 characters min
    fileName = process.env.FILENAME,
    url = process.env.URL,
    encrypt = crypto.createCipher(algorithm, password);

console.log('password', JSON.stringify(password));

const readStream = fs.createReadStream(path.join(__dirname, fileName), {highWaterMark: 500});
const writeStream = request.post(url);

readStream.pipe(encrypt).pipe(writeStream);

let upload_progress = 0;

readStream.on("data", function (chunk) {
    upload_progress += chunk.length;
    console.log(new Date(), upload_progress);
});

readStream.on("end", function () {
    console.log('Finished');
});