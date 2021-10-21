import { ObjectId } from 'mongoose';

import Address from './Address';
import Social from './Social';
import Dish from './Dish';

export default interface Restaurant {
    id: ObjectId;
    admin: ObjectId;
    restName:String;
    type:  String;
    layout: 'grid' | 'list';
    logo: String;
    restDescription: String;
    highlights: String[];
    social: Social;
    menu: Dish[];
    date: Date;
}