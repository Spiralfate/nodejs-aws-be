'use strict';
const AWS = require('aws-sdk');
const BUCKET_NAME = 'my-2nd-app-er-files';
const BUCKET_PREFIX = 'uploaded';

module.exports.importProductsFile = async event => {
  let result;
  const headers = {
    "Access-Control-Allow-Headers" : "Content-Type",
    "Access-Control-Allow-Origin": "http://my-2nd-app-er.s3-website-us-east-1.amazonaws.com",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  };

  try {
    const catalogName = event.queryStringParameters.name;
  
    const s3 = new AWS.S3({ region: 'us-east-1`' });
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${BUCKET_PREFIX}/${catalogName}`,
        Expires: 60,
        ContentType: 'text/csv',
    };

    return new Promise((resolve, reject) => {
      s3.getSignedUrl('putObject', params, (error, url) => {
        if (error) {
            reject(error);
        } else {
          resolve({
            statusCode: 200,
            headers,
            body: url,
          });
        }
      });
    });
  } catch (e) {
    return {
      statusCode: 404,
      headers,
      body: null,
  }
  }
};