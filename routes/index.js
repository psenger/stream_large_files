const { Router } = require('express');
const fs = require('fs');
const path = require('path');

const router = Router();

router.post('/', function (req, res, next) {
    req.pipe(fs.createWriteStream(path.join(__dirname, '..', 'new_file.tar.gz')));
    req.on('end', next);
});

router.get('/', function (req, res, next) {
    const readStream = fs.createReadStream(path.join(__dirname, '..', 'new_file.tar.gz'));
    let download_progress = 0;

    readStream.on("data", function (chunk) {
        download_progress += chunk.length;
        console.log(new Date(), download_progress);
    });

    readStream.on('end', function () {
        console.log('Finished');
        next();
    });
    res.pipe(readStream);
});

module.exports = router;
