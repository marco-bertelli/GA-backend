import { Schema, model } from 'mongoose';
import { OfficeDocument } from './interfaces/index';

const OfficesSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

const Office = model<OfficeDocument>('Office', OfficesSchema);

export { Office }