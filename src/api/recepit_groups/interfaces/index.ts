import { Document, Types } from 'mongoose';
import { ArticleDocument } from '../../articles/interfaces';

export interface RecepitGroupDocument extends Document {
    code: String,
    internalCode: Number
    recepitId: Types.ObjectId
    name: String
    total: Number
    qty: Number
    discountPercentage: Number,
    notes: String
    unitPrice: Number,
    articleId: Types.ObjectId,
    article: ArticleDocument,
}