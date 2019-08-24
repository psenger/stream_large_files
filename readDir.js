const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const readdir = Promise.promisify(fs.readdir);
const co = require('co');
const folderPath = '/Users/psenger/Documents/Dev/stream_large_files/node_modules';

const deep = function* (folderPath) {
    const results = yield readdir(folderPath, {withFileTypes: true});
    const deeper = co.wrap(function* (dirent) {
        const ref = {};
        if ( dirent.isFile() || dirent.isDirectory()) {
            ref.name = dirent.name;
        }
        if (dirent.isDirectory()) {
            ref.items = yield deep(path.join(folderPath, dirent.name));
        }
        return ref;
    });
    return Promise.map(
        results,
        deeper
    ) // [{name:'value'},{name:'value',items:[{'value',false}]}];
};

co(deep(folderPath))
    .then((r) => {
        console.log( JSON.stringify(r, null, 4) );
    });