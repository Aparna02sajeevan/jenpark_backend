const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const env = require("../config/env");

const s3Client = new S3Client({
    region: env.aws.region,
    endpoint: env.aws.endpoint,
    credentials: {
        accessKeyId: env.aws.accessKey,
        secretAccessKey: env.aws.secretKey,
    },
    forcePathStyle: true,
});

async function uploadFile(file) {

    const fileName =
        `users/${Date.now()}-${file.originalname}`;

    try {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: env.aws.bucket,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            })
        );
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

    return `${env.aws.cdnUrl}/${fileName}`;
}

module.exports = {
    uploadFile,
};