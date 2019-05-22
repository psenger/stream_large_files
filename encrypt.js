const crypto = require('crypto');

const IV_LENGTH = 16; // For AES, this is always 16
const ALGORITHM = 'aes-256-cbc';

function encrypt(text, key) {
    if ( key.length !== 32 ) throw new Error('AES Key Must be 256 bytes (32 characters)');
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(ALGORITHM, new Buffer(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text, key) {
    if ( key.length !== 32 ) throw new Error('AES Key Must be 256 bytes (32 characters)');
    let textParts = text.split(':');
    let iv = new Buffer(textParts.shift(), 'hex');
    let encryptedText = new Buffer(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(ALGORITHM, new Buffer(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

function encryptStream(key) {
    if ( key.length !== 32 ) throw new Error('AES Key Must be 256 bytes (32 characters)');
    return crypto.createCipher(ALGORITHM, key);
}

function decryptStream(key) {
    if ( key.length !== 32 ) throw new Error('AES Key Must be 256 bytes (32 characters)');
    return crypto.createDecipher(ALGORITHM, key);
}

module.exports = { decrypt, encrypt, encryptStream, decryptStream };