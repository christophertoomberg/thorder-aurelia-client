import { AppState } from 'state/app-state';
import { ParcelTypeService } from './../../services/parcel-type-service';
import { IParcelType } from './../../domain/IParcelType';
import { OrderItemService } from './../../services/orderitem-service';
import { IOrderItem } from './../../domain/IOrderItem';
import { IOrder } from './../../domain/IOrder';
import { RouteConfig, NavigationInstruction } from 'aurelia-router';
import { OrderService } from './../../services/order-service';
import { autoinject } from 'aurelia-framework';

@autoinject
export class OrderDetails {

    private _order?: IOrder;
    private _orderItems: IOrderItem[] = [];
    private _parcelTypes: IParcelType[] = [];
    private _selectedParcelType?: IParcelType;
    private _trackingLink: string = "";


    constructor(private orderService: OrderService,
        private orderItemService: OrderItemService,
        private parcelTypeService: ParcelTypeService,
        private appState: AppState) {

    }

    activate(params: any, routeConfig: RouteConfig, navigationInstruction: NavigationInstruction) {
        if (params.id && typeof (params.id) == 'string') {
            this.orderService.getOrder(params.id).then(
                response => {
                    if (response.statusCode == 200) {
                        this._order = response.data!;
                        this.orderItemService.getOrderItemsForOrder(params.id).then(
                            response => {
                                if (response.statusCode == 200) {
                                    this._orderItems = response.data!;
                                    this.parcelTypeService.getParcelTypes().then(
                                        response => {
                                            if (response.statusCode == 200) {
                                                this._parcelTypes = response.data!;
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    } 
                }
            )
        }
    }

    // Add tracking link, if possible
    addTrackingLink(){
        if (this._trackingLink != "") {
            this._order!.trackingLink = this._trackingLink;
            this.orderService.updateOrder(this._order!).then(
                response => {
                    if (response.statusCode == 204) {
                    }
                }
            );
            this._trackingLink = "";
        }
    }
}
