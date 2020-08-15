import { IOrderStatus } from './../../domain/IOrderStatus';
import { OrderStatusService } from './../../services/order-status-service';
import { OrderService } from './../../services/order-service';
import { IAlertData } from './../../types/IAlertData';
import { OrderItemService } from 'services/orderitem-service';
import { IOrderItem } from './../../domain/IOrderItem';
import { autoinject } from 'aurelia-framework';
import { AlertType } from 'types/AlertType';
@autoinject
export class OrderItemsIndex {
    private _alert: IAlertData | null = null;
    private _orderItems: IOrderItem[] = [];
    private _orderStatuses: IOrderStatus[] = [];

    constructor(private orderItemService: OrderItemService,
        private orderService: OrderService,
        private orderStatusService: OrderStatusService) {

    }

    attached() {
        this.orderItemService.getOrderItemsForUser().then(
            response => {
                console.log(response);
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    this._orderItems = response.data!;
                    this._alert = null;
                } else if (response.statusCode == 401) {
                    // show error message
                    this._alert = {
                        message: 'Please log out and then in again to access your data.',
                        type: AlertType.Danger,
                        dismissable: true
                    }
                }
            }
        );
    }
}
