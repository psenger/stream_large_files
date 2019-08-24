const crypto = require('crypto');

const IV_LENGTH = 16; // For AES, this is always 16
const ALGORITHM = 'aes-256-cbc';

function encrypt(text, key) {
    if ( key.length !== 32 ) throw new Error('AES Key Must be 256 bytes (32 characters)');
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);
    let encrypted = cipher.update(`${ ( Math.round ( ( new Date().getTime() * Math.random() ) / Math.random() ) ).toString(16) }\n${text}`);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text, key) {
    if ( key.length !== 32 ) throw new Error('AES Key Must be 256 bytes (32 characters)');
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const [date,...rest] =decrypted.toString().split('\n');
    return rest.join('\n');
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