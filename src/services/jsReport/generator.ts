import { PdfCreatorApi } from './index';
import config from '../../config';
import moment from 'moment';

import * as aws from 'aws-sdk';

const {
    s3BucketName,
    accessKeyId,
    secretAccessKey,
    jsReportUser,
    jsReportPass,
    jsReportUri
  } = config;

aws.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey
});

const pdfCreator = PdfCreatorApi(s3BucketName, aws, jsReportUri, jsReportUser, jsReportPass);

export default pdfCreator;

export function createPdf(entity: any, jsReportTemplateName: any, prefix: any, fileCode: any, lead: any, type = 'pdf'): any {
  const fileName = `${prefix}_${fileCode}_${moment().format('YYYYMMDDHHmmss')}.pdf`;
  const path = pdfCreator.createPdf(fileName, jsReportTemplateName, entity);
  return path
}
