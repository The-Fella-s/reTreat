const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; // AES-256-CBC encryption
const key = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest(); // Ensure it's 32 bytes
const ivLength = 16; // AES block size for CBC mode

function encrypt(text) {
    const iv = crypto.randomBytes(ivLength); // 16-byte initialization vector
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
    if (!text) return text; // Handle null, undefined, or empty strings
    const textParts = text.split(':');
    if (textParts.length < 2) throw new Error('Invalid encrypted text');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };
