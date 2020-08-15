export interface IUserDiscountCode {
    id: string;
    appUserId: string;
    codeValue: string;
    discountMultiplier: number;
    codeAmount: number;
    codeIsUsed: boolean;
}
