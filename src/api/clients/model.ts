import { Schema, model } from 'mongoose';
import { personalInfoModel } from '../_common-schemas';
import { ClientDocument } from './interfaces/index';

const ClientsSchema = new Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        trim: true,
        lowercase: true,
    },
    name: {
        type: String,
        isOdinSensitive: true
    },
    surname: {
        type: String
    },
    personalInfo: {
        type: personalInfoModel
    }
});



const Client = model<ClientDocument>('Client', ClientsSchema);


export { Client }