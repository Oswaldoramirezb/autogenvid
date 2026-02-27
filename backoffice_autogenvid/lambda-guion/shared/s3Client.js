'use strict';

const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const region = process.env.AWS_REGION || 'us-east-1';
const s3 = new S3Client({ region });

/**
 * Genera una URL prefirmada para acceso temporal a un objeto en S3.
 * @param {string} bucket
 * @param {string} key
 * @param {number} expiresIn  segundos (default 3600)
 */
async function getPresignedUrl(bucket, key, expiresIn = 3600) {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(s3, command, { expiresIn });
}

/**
 * Sube un buffer o stream a S3.
 * @param {string} bucket
 * @param {string} key
 * @param {Buffer|Uint8Array} body
 * @param {string} contentType
 */
async function putObject(bucket, key, body, contentType = 'application/octet-stream') {
    const command = new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType });
    return s3.send(command);
}

module.exports = { s3, getPresignedUrl, putObject };
