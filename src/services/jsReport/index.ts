import Promise from 'bluebird';
// @ts-ignore
import request from 'request';
// @ts-ignore
import UploadStream from 's3-stream-upload';

export const PdfCreatorApi = function (s3PdfBucketName: string, awsInstance: { S3: new () => any; }, jsreportUri: any, jsreportUser: any, jsreportPass: any) {

    const s3 = new awsInstance.S3();

    let createPdf = (fileNameComplete: string, templateName: any, data: any) => {
        let options = {
            method: 'POST',
            uri: jsreportUri, //
            encoding: 'binary',
            headers: {
                'Content-type': 'application/json'
            },
            body: {
                template: {
                    name: templateName,
                    recipe: 'chrome-pdf'
                },
                data: data,
                options: {
                    timeout: 60000
                }
            },
            auth: {
                user: jsreportUser,
                pass: jsreportPass,
                sendImmediately: false
            },
            json: true // Automatically stringifies the body to JSON
        };
        let baseUrl = 'https://s3-eu-central-1.amazonaws.com/' + s3PdfBucketName + '/';
        const filePath = baseUrl + fileNameComplete;
        return new Promise((resolve, reject) => {
            request(options)
                .pipe(
                    UploadStream(s3, {
                        Bucket: s3PdfBucketName,
                        Key: fileNameComplete,
                        ACL: 'public-read',
                        ContentType: 'application/pdf',
                        ContentDisposition: 'inline'
                    })
                )
                .on('error', function (err: any) {
                    reject(err);
                })
                .on('finish', function () {
                    resolve(filePath);
                });
        });
    };

    // Return createPdf function
    return {
        createPdf
    };
    
};
