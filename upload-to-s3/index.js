const core = require('@actions/core');
const aws = require('aws-sdk');
const fs = require('fs');
const md5File = require('md5-file');
const path = require('path');
const archiver = require('archiver');

try {
    const src = core.getInput('srcPath');
    const isFolder = fs.lstatSync(src).isDirectory();
    const bucket = core.getInput('bucket');
    const filename = core.getInput('filename');
    console.log('Source = ', src);
    console.log('Folder = ', isFolder);
    console.log('Destination = ', bucket + '/' + filename);

    if (isFolder) {
        const output = fs.createWriteStream(filename);
        const zipArchiver = archiver('zip', {
            zlib: {level: 9} // Sets the compression level.
        });
        zipArchiver.pipe(output);

        output.on('close', function () {
            console.log(zipArchiver.pointer() + ' total bytes');
            console.log('Archiver has been finalized and the output file descriptor has closed.');
            upload(bucket, filename, filename);
        });

        zipArchiver.on('error', function (err) {
            core.setFailed(err);
        });

        zipArchiver.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                console.log('Archiver warning: ', err.message);
            } else {
                core.setFailed(err);
            }
        });

        zipArchiver.on('error', function (err) {
            core.setFailed(err);
        });

        zipArchiver.directory(src, '/');
        zipArchiver.finalize();
    } else {
        upload(bucket, src, filename);
    }
} catch (error) {
    core.setFailed(error.message);
}

function upload(bucket, src, dest) {
    const fileStream = fs.createReadStream(src);
    fileStream.on('error', function (err) {
        console.log('File error', err);
    });
    const uploadParams = {Bucket: bucket, Key: path.basename(dest), Body: fileStream};

    aws.config.accessKeyId = process.env.AWS_KEY_ID;
    aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const s3 = new aws.S3();
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            core.setFailed('Upload failed: ' + err);
        } else if (data) {
            console.log('Upload success', data.Location);
            core.setOutput('md5', md5File.sync(src));
        }
    });
}
