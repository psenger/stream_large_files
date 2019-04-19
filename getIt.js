const fs = require('fs'),
    path = require('path'),
    request = require('request'),
    crypto = require('crypto');

const algorithm = 'aes-256-cbc',
    password = process.env.PASSWORD, // 32 characters min
    fileName = process.env.FILENAME,
    url = process.env.URL,
    decrypt = crypto.createDecipher(algorithm, password);

console.log('password', JSON.stringify(password));

const writeStream = fs.createWriteStream(path.join(__dirname, fileName));
const readStream = request.get(url);

readStream.pipe(decrypt).pipe(writeStream);

let upload_progress = 0;

readStream.on("data", function (chunk) {
    upload_progress += chunk.length;
    console.log(new Date(), upload_progress);
});

readStream.on("end", function () {
    console.log('Finished');
});