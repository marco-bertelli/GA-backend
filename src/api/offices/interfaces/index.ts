import { Document } from 'mongoose';

export interface OfficeDocument extends Document {
    name: string,
}