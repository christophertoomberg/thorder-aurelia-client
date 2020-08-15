import { AppState } from 'state/app-state';
import { IOrderStatus } from './../../domain/IOrderStatus';
import { RouteConfig, NavigationInstruction, Router } from 'aurelia-router';
import { OrderService } from './../../services/order-service';
import { autoinject } from 'aurelia-framework';
import { OrderStatusService } from 'services/order-status-service';
import { param } from 'jquery';
import { IOrder } from 'domain/IOrder';

@autoinject
export class OrderEdit {

    private _order?: IOrder;
    private _orderStatuses: IOrderStatus[] = [];
    private _selectedOrderStatus?: IOrderStatus;

    constructor(private orderService: OrderService,
        private orderStatusService: OrderStatusService,
        private router: Router,
        private appState: AppState) {

    }

    attached() {
        this.orderStatusService.getOrderStatuses().then(
            response => {
                if (response.statusCode == 200) {
                    this._orderStatuses = response.data!;
                }
            }
        );
    }


    activate(params: any, routeConfig: RouteConfig, navigationInstruction: NavigationInstruction) {
        if (params.id && typeof (params.id) == 'string') {
            this.orderService.getOrder(params.id).then(
                response => {
                    if (response.statusCode == 200) {
                        this._order = response.data!;
                    }
                }
            )
        }
    }

    updateOrderStatus() {
        if (this._selectedOrderStatus != undefined) {
            this._order!.orderStatusId = this._selectedOrderStatus!.id;
            this.orderService.updateOrder(this._order!).then(
                response => {
                    if (response.statusCode == 204)
                        console.log('succes');
                        this.router!.navigateToRoute('orders-index')
                }
            )

        }
    }
}
