import { RecepitGroupDocument } from "../../recepit_groups/interfaces";
import { RecepitDocument } from "../interfaces";
import { uploadFile } from "../../../services/manualUploader/s3";
import { Types } from "mongoose";

import moment from "moment";

import * as fs from 'fs';
import * as os from 'os';

export async function generateDeliveryTxtFile(recepitGroups: RecepitGroupDocument[], recepit: RecepitDocument) {
    let fileContent = '';

    recepitGroups.forEach((group) => {
        const ddtCode = recepit.ddtCode || '';
        const today = moment().format('YYYYMMDD').toString();
        const article = group.article;
        const formattedQty = group.qty.toString().padStart(6, '0').padEnd(9, '0');

        fileContent += `${ddtCode?.padEnd(20, ' ')}${today}${article.sellerCode?.padEnd(20, ' ')}${article.articleCode?.padEnd(20, ' ')}${article.articleColorCode?.padEnd(20, ' ')}${article.articleMeasureCode?.padEnd(3, ' ')}${article.articleColloCode?.padEnd(20, ' ')}${article.articleDeliveryCode?.padEnd(20, ' ')}${formattedQty}\n`;
    });

    const localFilePath = `${os.tmpdir()}/${recepit._id}.txt`;

    fs.writeFileSync(`${os.tmpdir()}/${recepit._id}.txt`, fileContent);

    const Upload = await uploadFile(localFilePath, `${new Types.ObjectId()}.txt`);

    return Upload.Location;
}