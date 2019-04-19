const {Router} = require('express'),
    fs = require('fs'),
    path = require('path'),
    crypto = require('crypto');

const algorithm = 'aes-256-cbc',
    password = process.env.PASSWORD, // 32 characters min
    fileName = process.env.FILENAME,
    router = Router();

console.log('password', JSON.stringify(password));

router.post('/', function (req, res, next) {
    let decrypt = crypto.createDecipher(algorithm, password);
    req.pipe(decrypt).pipe(fs.createWriteStream(path.join(__dirname, '..', fileName)));
    req.on('end', next);
});

router.get('/', function (req, res, next) {
    // let encrypt = crypto.createCipheriv(algorithm, password, iv);
    let encrypt = crypto.createCipher(algorithm, password);
    const readStream = fs.createReadStream(path.join(__dirname, '..', fileName));
    let download_progress = 0;
    readStream.on("data", function (chunk) {
        download_progress += chunk.length;
        console.log(new Date(), download_progress);
    });
    readStream.on('end', function () {
        console.log('Finished');
        next();
    });
    readStream.pipe(encrypt).pipe(res);
});

module.exports = router;
