import { Document } from 'mongoose';

export interface ArticleDocument extends Document {
    name: String,
    prices: Number[]
}