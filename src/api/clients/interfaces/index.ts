import { Document } from 'mongoose';

export interface ClientDocument extends Document {
    email: string,
    name: string,
    surname: string,
    personalInfo: Object,
}