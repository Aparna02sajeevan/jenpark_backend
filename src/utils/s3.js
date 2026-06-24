const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const env = require('../config/env');

const s3 = new S3Client({
    region: env.aws.region || 'us-east-1',
    endpoint: env.aws.endpoint,          // https://s3.diginexatechnologies.com
    forcePathStyle: true,                // required for MinIO / custom S3 endpoints
    credentials: {
        accessKeyId: env.aws.accessKey,
        secretAccessKey: env.aws.secretKey,
    },
});

/**
 * Uploads a file buffer to S3 and returns the public URL.
 *
 * @param {Buffer} buffer      - File content
 * @param {string} originalName - Original filename (used for extension)
 * @param {string} folder       - S3 folder/prefix (e.g. 'users')
 * @param {string} mimeType     - MIME type of the file
 * @returns {Promise<string>}   - Public URL of the uploaded file
 */
async function uploadToS3(buffer, originalName, folder, mimeType) {
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');          // sanitise filename
    const key = `${folder}/${Date.now()}-${baseName}${ext}`;

    try {
        await s3.send(new PutObjectCommand({
            Bucket: env.aws.bucket,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
            ACL: 'public-read',
        }));
    } catch (err) {
        if (err.$response && err.$response.body) {
            try {
                const chunks = [];
                for await (const chunk of err.$response.body) {
                    chunks.push(chunk);
                }
                const bodyString = Buffer.concat(chunks).toString('utf-8');
                console.error(`[S3 Upload Error] Raw response body: ${bodyString}`);
            } catch (readErr) {
                // Ignore read error
            }
        }
        throw err;
    }

    // Returns e.g. https://s3.diginexatechnologies.com/jenpark/users/1781244786258-new.jpeg
    return `${env.aws.cdnUrl}/${key}`;
}

/**
 * Detects if a string is a base64-encoded image or data URL.
 * @param {string} str
 * @returns {boolean}
 */
function isBase64(str) {
    if (typeof str !== 'string') return false;
    if (str.startsWith('data:image/')) return true;
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return str.length > 50 && base64Regex.test(str);
}

/**
 * Decodes and uploads a base64-encoded image string to S3.
 * @param {string} base64Str - base64 string or data URL
 * @param {string} folder - target S3 folder
 * @returns {Promise<string>} - public URL of the uploaded image
 */
async function uploadBase64ToS3(base64Str, folder) {
    let buffer;
    let mimeType = 'image/jpeg';
    let ext = '.jpg';

    const matches = base64Str.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-+.]+);base64,(.+)$/);
    if (matches) {
        mimeType = matches[1];
        const base64Data = matches[2];
        buffer = Buffer.from(base64Data, 'base64');
        const parts = mimeType.split('/');
        if (parts.length === 2) {
            ext = `.${parts[1]}`;
        }
    } else {
        buffer = Buffer.from(base64Str, 'base64');
        if (buffer.length > 4) {
            const hex = buffer.toString('hex', 0, 4);
            if (hex.startsWith('89504e47')) {
                mimeType = 'image/png';
                ext = '.png';
            } else if (hex.startsWith('47494638')) {
                mimeType = 'image/gif';
                ext = '.gif';
            } else if (hex.startsWith('ffd8ff')) {
                mimeType = 'image/jpeg';
                ext = '.jpg';
            }
        }
    }

    const originalName = `base64-upload${ext}`;
    return uploadToS3(buffer, originalName, folder, mimeType);
}

module.exports = { s3, uploadToS3, isBase64, uploadBase64ToS3 };

