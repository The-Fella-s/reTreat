const crypto = require('crypto');

function generateIdempotencyKey() {
    return crypto.randomBytes(32).toString('hex');
}

module.exports = { generateIdempotencyKey };