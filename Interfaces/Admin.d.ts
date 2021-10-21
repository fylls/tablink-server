import { ObjectId } from 'mongoose';

export default interface Admin {
    email: String;
    name: String;
    phone: String;
    password:String;
    restaurants: ObjectId[];
    date: Date;
}