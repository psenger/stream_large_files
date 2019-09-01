const crypto = require('crypto');
const { Transform } = require('stream');

// For AES, this is always 16
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-cbc';
const buildKey = (password, salt) => Buffer.from(crypto.scryptSync(password, salt, 32));

const encrypt = function encrypt(text, password, salt) {
    const key = buildKey(password, salt);
    let initializationVector = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(ALGORITHM, key, initializationVector);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return initializationVector.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = function decrypt(text, password, salt) {
    const key = buildKey(password, salt);
    let textParts = text.split(':');
    // key and iv must be 'binary' encoded strings or buffers.
    let initializationVector = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(ALGORITHM, key, initializationVector);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

const buildCipherStream = function buildCipherStream(password, salt) {
    /**
     * I want to put the IV in front of the encrypted data. So, when I start reading the stream,
     * I have the IV and can decrypt via piping immediately.
     */
    class AppendInitializationVectorTransformer extends Transform {
        constructor(initializationVector, opts) {
            super(opts);
            this.initializationVector = initializationVector;
            this.appended = false;
        }

        _transform(chunk, encoding, callback) {
            if (!this.appended) {
                this.push( Buffer.concat([ this.initializationVector, chunk ] ) );
                this.appended = true;
                return callback();
            }
            this.push(chunk);
            callback();
        }
    }
    const key = buildKey(password, salt);
    let initializationVector = crypto.randomBytes(IV_LENGTH);
    const ivStream = new AppendInitializationVectorTransformer(initializationVector);
    const cipherStream = crypto.createCipheriv(ALGORITHM, key , initializationVector);
    return { cipherStream, ivStream }
};

const buildDecipherStream = function buildDecipherStream( password, salt ) {
    class DecipherTransformer extends Transform {
        constructor(algorithm, key, opts) {
            super(opts);
            this.algorithm = algorithm;
            this.key = key;
            this.decipher = null;
        }

        _transform( chunk, encoding, callback ) {
             if ( ! this.decipher ) {
                 this.decipher = crypto.createDecipheriv( this.algorithm, this.key, chunk.slice( 0, IV_LENGTH ), null );
                 chunk = chunk.slice( IV_LENGTH, chunk.length )
            }
            const decrypted = this.decipher.update(chunk);
            this.push( Buffer.alloc(decrypted.length, decrypted) );
            callback();
        }
        _flush(callback) {
            if ( this.decipher ) {
                this.push( this.decipher.final() );
            }
            callback();
        }
    }

    const key = buildKey(password, salt);
    return new DecipherTransformer( ALGORITHM, key, salt );
};

module.exports = { decrypt, encrypt, buildCipherStream, buildDecipherStream };