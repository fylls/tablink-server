import { Request } from 'express';
import { ObjectId } from 'mongoose';

export default interface ExtendedRequest extends Request {
    admin: ObjectId
}