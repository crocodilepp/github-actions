const core = require('@actions/core');
const github = require('@actions/github');
const aws = require('aws-sdk');
const fs = require('fs');
const md5File = require('md5-file');

try {
    const bucket = core.getInput('bucket');
    const downloadFile = core.getInput('filePath');
    console.log('Bucket = ', bucket);
    console.log('File = ', downloadFile);

    const downloadParams = {
        Bucket: bucket,
        Key: downloadFile,
    };

    aws.config.accessKeyId = process.env.AWS_KEY_ID;
    aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const s3 = new aws.S3();
    s3.getObject(downloadParams, function (err, data) {
        if (err) {
            core.setFailed('Download failed: ' + err);
        } else {
            fs.writeFile(downloadFile, data.Body, function (err) {
                if (err) {
                    core.setFailed('Download failed: ' + err);
                } else {
                    console.log('Download success', data.Location);
                    core.setOutput('md5', md5File.sync(downloadFile));
                }
            })
        }
    });
} catch (error) {
    core.setFailed(error.message);
}
