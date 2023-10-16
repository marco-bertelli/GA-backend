import { Document, Types } from 'mongoose';

export interface RecepitDocument extends Document {
    code: String,
    internalCode: Number
    internalProspectCode: Number
    prospectCode: String
    year: Number
    data: Date
    clientId: Types.ObjectId,
    creatorId: Types.ObjectId,
    total: Number,
    notes: String
    createdAt: Date,
    pdfUrl: string,
    deliveryFileUrl: string,
    ddtCode: string,
    updateCosts: () => any;
}