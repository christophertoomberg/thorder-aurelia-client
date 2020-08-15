export interface IOrderItem {
    id: string,
    appUserId: string,
    orderItemURL: string,
    orderItemPictureURL: string,
    orderItemName: string,
    orderItemPrice: number,
    orderItemQuantity: number,
    fee: number,
    parcelTypeId: string,
    totalPrice: number,
    deliveryLocation: string,
    orderId: string,
    paymentId: string
    orderDate: string
}
