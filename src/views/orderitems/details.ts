import { IParcelType } from './../../domain/IParcelType';
import { ParcelTypeService } from './../../services/parcel-type-service';
import { IComment } from './../../domain/IComment';
import { CommentService } from './../../services/comment-service';
import { IOrderStatus } from './../../domain/IOrderStatus';
import { OrderService } from './../../services/order-service';
import { IOrderItem } from './../../domain/IOrderItem';
import { IAlertData } from './../../types/IAlertData';
import { NavigationInstruction, RouteConfig } from 'aurelia-router';
import { OrderItemService } from 'services/orderitem-service';
import { autoinject } from 'aurelia-framework';
import { AlertType } from 'types/AlertType';
import { format } from 'date-fns';
import { OrderStatusService } from 'services/order-status-service';
import { IOrder } from 'domain/IOrder';

@autoinject
export class OrderItemDetails {

    private _statusType: string = '';
    private _orderItem?: IOrderItem;
    private _alert: IAlertData | null = null;
    private _orderDate: string = format(new Date(), 'MMMM do, yyyy')
    private _orderStatus?: IOrderStatus;
    private _order?: IOrder;
    private _comments: IComment[] = [];
    private _parcelType?: IParcelType;

    constructor(private orderItemService: OrderItemService,
                private orderService: OrderService,
                private orderStatusService: OrderStatusService,
                private commentService: CommentService,
                private parcelTypeService: ParcelTypeService) {

    }

    attached() {
    }

    activate(params: any, routeConfig: RouteConfig, navigationInstruction: NavigationInstruction) {
        if (params.id && typeof (params.id) == 'string') {
            this.orderItemService.getOrderItem(params.id).then(
                response => {
                    if (response.statusCode >= 200 && response.statusCode < 300) {
                        this._alert = null;
                        this._orderItem = response.data!;
                        this.orderService.getOrder(this._orderItem.orderId).then(
                            response => {
                                if (response.statusCode == 200) {
                                    this._order = response.data!;
                                    this.orderStatusService.getOrderStatus(response.data!.orderStatusId).then(
                                        response => {
                                            if (response.statusCode == 200) {
                                                this._orderStatus = response.data!;
                                                if (this._orderStatus.orderStatusName == 'Awaiting completion') {
                                                    this._statusType = 'danger';
                                                } else if (this._orderStatus.orderStatusName == 'Completed') {
                                                    this._statusType = 'warning';
                                                } else if (this._orderStatus.orderStatusName == 'Shipping') {
                                                    this._statusType = 'info';
                                                } else if (this._orderStatus.orderStatusName == 'Shipped') {
                                                    this._statusType = 'success';
                                                }
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    } else {
                        this._alert = {
                            message: response.statusCode.toString(),
                            type: AlertType.Danger,
                            dismissable: true
                        };
                    }
                }
            );
            this.commentService.getComments(params.id).then(
                response => {
                    if (response.statusCode == 200) {
                        this._comments = response.data!;
                    } else {

                    }
                }
            );
        }   
    }
}
