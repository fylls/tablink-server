import { ObjectId } from 'mongoose';

export default interface Dish {
    id: ObjectId;
    name: String;
    image: String;
    price: String;
    description: String;
    category: String;
    tags: [String];
    ingredients: [String];
    recommendation: [ObjectId];
    percentage: String;
    views: Number;
    available: Boolean;
}