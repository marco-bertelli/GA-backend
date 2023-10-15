import { Schema, model } from 'mongoose';
import { ArticleDocument } from './interfaces/index';

const ArticlesSchema = new Schema({
    name: {
        type: String
    },
    sellerCode: {
        type: String
    },
    articleCode: {
        type: String
    },
    articleColorCode: {
        type: String
    },
    articleMeasureCode: {
        type: String
    },
    articleColloCode: {
        type: String
    },
    // use this field to handle multiple prices so an operator can insert multiple prices
    // and when selecting this item i have to choose only ONE of this price
    prices: {
        type: [Number],
    },
    articleType: {
        type: String,
        enum: ['admin', 'user'],
        default: 'admin'
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

const Article = model<ArticleDocument>('Article', ArticlesSchema);

export { Article }