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

module.exports = { s3, uploadToS3 };
