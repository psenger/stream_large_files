const rp = require('request-promise'),
    {decrypt} = require('../src/utils/cryptoWrapper');

const password = process.env.PASSWORD,
    url = process.env.URL;

rp(url)
    .then(function (string) {
        return decrypt(string, password)
    })
    .then((r) => {
        console.log(JSON.stringify(JSON.parse(r), null, 4));
    })
    .catch(function (err) {
        console.error(err);
    });