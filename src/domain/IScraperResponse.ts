export interface IScraperResponse {
    orderItemName: string;
    orderItemURL: string;
    orderItemPictureURL: string;
    orderItemPrice: number;
    quantity: number | null;
    comment: string | null;
}
