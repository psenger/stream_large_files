const {Router} = require('express'),
    fs = require('fs'),
    path = require('path'),
    { decrypt, encrypt, buildCipherStream, buildDecipherStream } = require('../utils/cryptoWrapper'),
    readDir = require('../utils/readDir');

const password = process.env.PASSWORD, // 32 characters min
    salt = process.env.SALT,
    shareDirectory = process.env.SHARE_DIRECTORY, // 32 characters min
    router = Router();

if ( password.length !== 32 ) throw new Error('AES Key Must be 256 bytes (32 characters)');

router.post('/', function (req, res, next) {
    const fileName = decrypt( req.header('File-Name'), password, salt );
    req.pipe(buildDecipherStream(password, salt)).pipe(fs.createWriteStream(path.join(shareDirectory, fileName)));
    req.on('end', next);
});
router.get('/', function (req, res, next) {
    readDir(shareDirectory)
        .then((json)=>{
            res.writeHead(200);
            res.end( encrypt( JSON.stringify(json), password, salt ) );
            next();
        })
});
module.exports = router;
