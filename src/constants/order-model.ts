import {Item} from './item-model';

export class OrderDetail {
    SPECIAL: Array<Item>;
    NORMAL: Array<Item>;
    OTHERS: Array<Item>;
    DETAIL: {
        ORDERID: string,
        ADDITIONALS: {
            SCENT: string;
            REQUEST_BAG: boolean;
            NOTES: string;
        }
        PRICE: Array<
            {
                NAME: string,
                PRICE: number
            }
        >;
        WEIGHT: object;
        SHIPPING: {
            DELIVERYTD: string;
            PICKUPTD: string;
            ORIGIN: string;
            DESTINATION: string;
            USERID: string;
            OUTLETID: string;
            NOTES: string;
        },
        PROGRESS: Array<{
            NAME: string,
            STATUS: boolean
        }>
    };

    constructor(
        SPECIAL: [],
        NORMAL: [],
        OTHERS: [],
        // tslint:disable-next-line:max-line-length
        DETAIL: { ORDERID: string; PRICE: [{ PRICE: number; NAME: string }, { PRICE: number; NAME: string }, { PRICE: number; NAME: string }, { PRICE: number; NAME: string }]; PROGRESS: any[]; WEIGHT: {}; ADDITIONALS: { NOTES: string; SCENT: string; REQUEST_BAG: boolean }; SHIPPING: { NOTES: string; ORIGIN: string; DELIVERYTD: string; DESTINATION: string; USERID: string; OUTLETID: string; PICKUPTD: string } }
    ) {}
}
