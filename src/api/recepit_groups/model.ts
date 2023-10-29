import { Schema, model, Types } from 'mongoose';
import { updateCosts } from '../recepits/model';
import { RecepitGroupDocument } from './interfaces/index';

const RecepitGroupsSchema = new Schema({
    code: {
        type: String,
    },
    internalCode: {
        type: Number
    },
    internalColloCode: {
        type: Number
    },
    recepitId: {
        type: Types.ObjectId
    },
    name: {
        type: String
    },
    total: {
        type: Number
    },
    qty: {
        type: Number
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    notes: {
        type: String
    },
    unitPrice: {
        type: Number,
    },
    articleId: {
        type: Types.ObjectId,
    },
    article: {
        type: Object,
    },
    pdfUrl: {
        type: String
    },
});


async function calculateTotalsFromArticles(this: any, next: () => any) {

    // from manual insert unitPrice calculate totals
    this.unitPrice = this.unitPrice || 0;
    this.total = this.unitPrice * this.qty;

    // percentuale di sconto sul totale SENZA iva
    const discountPercentage = this.discountPercentage ? (this.total / 100) * this.discountPercentage : 0;
    this.discountedPrice = this.total - discountPercentage;

    return next();
}

async function updateRecepitPrice(doc: any, next: () => any) {
    // update recepit totals
    await updateCosts(doc.recepitId)

    next();
}

RecepitGroupsSchema.pre('save', async function generateGroupCode(next) {
    if (!this.isNew) {
        return next();
    }

    const lastRecepit = await RecepitGroup.findOne({ recepitId: this.recepitId }).sort({ internalCode: -1 });

    this.internalCode = lastRecepit ? Number(lastRecepit.internalCode) + 1 : 1;
    this.code = `${('00000' + this.internalCode).slice(-6)}`;

    next();
});

RecepitGroupsSchema.pre('save', async function generateColloCode(next) {
    if (!this.isNew) {
        return next();
    }

    const lastRecepit = await RecepitGroup.findOne({ recepitId: this.recepitId }).sort({ internalColloCode: -1 });
    const currentYear = new Date().toLocaleDateString('en', { year: '2-digit' });

    this.internalColloCode = lastRecepit ? Number(lastRecepit.internalColloCode) + 1 : 1;
    this.article.articleColloCode = `P64${currentYear}${('00000' + this.internalColloCode).slice(-6)}`;

    next();
});

RecepitGroupsSchema.pre('save', calculateTotalsFromArticles);
RecepitGroupsSchema.pre('update', calculateTotalsFromArticles);

RecepitGroupsSchema.post('save', updateRecepitPrice);
RecepitGroupsSchema.post('update', updateRecepitPrice);
RecepitGroupsSchema.post('remove', updateRecepitPrice);

RecepitGroupsSchema.methods.calculateTotalsFromArticles = calculateTotalsFromArticles;

const RecepitGroup = model<RecepitGroupDocument>('RecepitGroup', RecepitGroupsSchema);

export { RecepitGroup }