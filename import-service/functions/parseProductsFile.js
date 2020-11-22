const AWS = require('aws-sdk');
const csv = require('csv-parser');

const BUCKET_NAME = 'my-2nd-app-er-files';
const BUCKET_PREFIX_SOURCE = 'uploaded';
const BUCKET_PREFIX_TARGET = 'parsed';

const parseProductsFile = event => {
    const s3 = new AWS.S3({ region: 'us-east-1' });
    const getObjectOptions = record => ({ Bucket: BUCKET_NAME, Key: record.s3.object.key });

    event.Records.forEach(record => {
        const options = getObjectOptions(record);

        console.log(`Parsing record ${JSON.stringify(record)}`);
        
        console.log(`Options to work with record: ${JSON.stringify(options)}`);
        const s3Stream = s3.getObject(options).createReadStream();

        s3Stream.pipe(csv())
            .on('data', data => {
                console.log(`Stream data: ${data}`);
            })
            .on('end', async () => {
                const key = record.s3.object.key;
                const newKey = record.s3.object.key.replace(BUCKET_PREFIX_SOURCE, BUCKET_PREFIX_TARGET);

                console.log(`Copy from ${BUCKET_NAME}/${key}`);

                await s3.copyObject({
                    Bucket: BUCKET_NAME,
                    CopySource: `${BUCKET_NAME}/${key}`,
                    Key: newKey,
                }).promise();
                console.log(`Copied into ${BUCKET_NAME}/${newKey}`);

                await s3.deleteObject({
                    Bucket: BUCKET_NAME,
                    Key: key
                }).promise();
                console.log(`Deleted from ${BUCKET_NAME}/${key}`);
            })
    });
  };

  module.exports = parseProductsFile;