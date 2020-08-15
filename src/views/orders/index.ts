import { AppState } from 'state/app-state';
import { IOrder } from './../../domain/IOrder';
import { OrderService } from './../../services/order-service';
import { autoinject } from 'aurelia-framework';

@autoinject
export class OrdersIndex {
    private _orders: IOrder[] = [];
    constructor(private orderService: OrderService,
                private appState: AppState) {

    }

    attached() {
        this.orderService.getOrders().then(
            response => {
                if (response.statusCode == 200) {
                    this._orders = response.data!;
                }
            }
        )
    }
}
