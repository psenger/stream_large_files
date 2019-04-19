const { Router } = require('express');
const fs = require('fs');
const path = require('path');

const router = Router();

router.post('/', function (req, res, next) {
    req.pipe(fs.createWriteStream(path.join(__dirname, '..', 'new_file.tar.gz')));
    req.on('end', next);
});


module.exports = router;
