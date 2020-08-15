export interface IOrder {
    id: string,
    orderMaxSum: number,
    orderCurrentSum: number,
    trackingLink: string | null,
    orderStatusId: string
}
