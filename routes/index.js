const {Router} = require('express'),
    fs = require('fs'),
    path = require('path'),
    { decryptStream, decrypt } = require('../encrypt');

const password = process.env.PASSWORD, // 32 characters min
    router = Router();

if ( password.length !== 32 ) throw new Error('AES Key Must be 256 bytes (32 characters)');

router.post('/', function (req, res, next) {
    const fileName = decrypt( req.header('File-Name'), password );
    req.pipe(decryptStream(password)).pipe(fs.createWriteStream(path.join(__dirname, '..', fileName)));
    req.on('end', next);
});

module.exports = router;
