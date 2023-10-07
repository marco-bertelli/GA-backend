import { Schema, model, Types } from 'mongoose';
import { RecepitGroup } from '../recepit_groups/model';
import { RecepitDocument } from './interfaces/index';

const RecepitsSchema = new Schema({
    code: {
        type: String,
    },
    internalCode: {
        type: Number
    },
    year: {
        type: Number
    },
    pdfUrl: {
        type: String
    },
    data: {
        type: Date
    },
    clientId: {
        type: Types.ObjectId,
    },
    creatorId: {
        type: Types.ObjectId,
    },
    total: {
        type: Number,
        default: 0
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: () => new Date()
    },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

export async function updateCosts(id: any) {
    const recepit = await Recepit.findById(id);

    if (!recepit) {
        throw new Error('recepit not found');
    }

    const groups = await RecepitGroup.find({ recepitId: recepit._id })
    const total = groups.reduce((total, group) => total + Number(group.total), 0);

    // use of updateOne instead of save because its populated
    await Recepit.updateOne({ '_id': recepit._id }, { '$set': { total } });

    return recepit;
}

async function generateInvoiceCode(this: any, next: () => void) {
    if (!this.isNew) {
        return next();
    }

    const currentYear = new Date().getFullYear();
    const lastrecepit = await Recepit.findOne({ year: currentYear }).sort({ internalCode: -1 });

    this.internalCode = lastrecepit ? Number(lastrecepit.internalCode) + 1 : 1;
    this.year = currentYear;
    this.code = `Q${('00' + this.internalCode).slice(-3)}_${this.year}`;

    next();
}

RecepitsSchema.pre('save', generateInvoiceCode);

// virtuals
RecepitsSchema.virtual('recepitGroups', {
    ref: 'RecepitGroup',
    localField: '_id',
    foreignField: 'recepitId'
})

RecepitsSchema.virtual('client', {
    ref: 'Client',
    localField: 'clientId',
    foreignField: '_id',
    justOne: true
})

RecepitsSchema.virtual('creator', {
    ref: 'User',
    localField: 'creatorId',
    foreignField: '_id',
    justOne: true
})

const Recepit = model<RecepitDocument>('Recepit', RecepitsSchema);

export { Recepit }