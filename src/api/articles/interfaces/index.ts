import { Document } from 'mongoose';

export interface ArticleDocument extends Document {
    name: String,
    prices: Number[],
    sellerCode: string,
    articleCode: string,
    articleColorCode: string,
    articleMeasureCode: string,
    articleColloCode: string,
    articleDeliveryCode: string,
}