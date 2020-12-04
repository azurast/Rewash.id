import { Address } from './address';

export class User {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: Array<Address>;
    imageUrl: string;
    phoneNumber: string;
    constructor() {}
}
