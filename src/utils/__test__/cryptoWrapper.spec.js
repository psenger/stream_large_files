const {encrypt,decrypt} = require('../cryptoWrapper');

const randomNumber = ( start, end ) => {
    return Math.floor (Math.random() * ( Math.abs(end) - Math.abs(start)) + Math.abs(start) )
};

function randomString(numberOfChars, { sampleSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' } = {}) {
    let str = '';
    for (let i = 0; i < numberOfChars; i++) {
        str += sampleSet[randomNumber(0,sampleSet.length) % sampleSet.length];
    }
    return str;
}

describe('cryptoWrapper',()=>{
    const key = randomString(32);
    const randomLetters = randomString(100);
    let encryptedString = '';
    describe('#encrypt',()=>{
        test('should encrypt without failing',()=>{
            encryptedString = encrypt(randomLetters,key);
            expect(encryptedString).not.toEqual('');
        })
        test('should fail due to invalid key length, 31', ()=>{
            expect(() => encrypt(encryptedString,key.slice(0, -1))).toThrow();
        })
        test('should fail due to invalid key length, 0', ()=>{
            expect(() => encrypt(encryptedString,'')).toThrow();
        })
        test('should fail due to invalid key length, undefined', ()=>{
            expect(() => encrypt(encryptedString)).toThrow();
        })
        test('should fail due to invalid key length, null', ()=>{
            expect(() => encrypt(encryptedString,null)).toThrow();
        })
    });
    describe('#decrypt',()=>{
        test('should decrypt without failing', ()=>{
            const unEncryptedString = decrypt(encryptedString,key);
            expect(unEncryptedString).not.toEqual(encryptedString);
        })
        test('should fail due to invalid key length, 31', ()=>{
            expect(() => decrypt(encryptedString,key.slice(0, -1))).toThrow();
        })
        test('should fail due to invalid key length, 0', ()=>{
            expect(() => decrypt(encryptedString,'')).toThrow();
        })
        test('should fail due to invalid key length, undefined', ()=>{
            expect(() => decrypt(encryptedString)).toThrow();
        })
        test('should fail due to invalid key length, null', ()=>{
            expect(() => decrypt(encryptedString,null)).toThrow();
        })
    });
})
