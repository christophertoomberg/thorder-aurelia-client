import { IOrderItemEdit } from './../../domain/IOrderItemEdit';
import { RouteConfig, NavigationInstruction } from 'aurelia-router';
import { IParcelType } from './../../domain/IParcelType';
import { IOrderItem } from './../../domain/IOrderItem';
import { ParcelTypeService } from './../../services/parcel-type-service';
import { OrderItemService } from 'services/orderitem-service';
import { autoinject } from 'aurelia-framework';

@autoinject
export class OrderItemEdit {

    private _orderItem?: IOrderItem;
    private _parcelTypes: IParcelType[] = [];
    private _selectedParcelType?: IParcelType;

    constructor(private orderItemService: OrderItemService,
        private parcelTypeService: ParcelTypeService) {

    }


    attached() {
        this.parcelTypeService.getParcelTypes().then(
            response => {
                if (response.statusCode == 200) {
                    this._parcelTypes = response.data!;
                }
            }
        );
    }

    activate(params: any, routeConfig: RouteConfig, navigationInstruction: NavigationInstruction) {
        if (params.id && typeof (params.id) == 'string') {
            this.orderItemService.getOrderItem(params.id).then(
                respone => {
                    if (respone.statusCode == 200) {
                        this._orderItem = respone.data!;
                    }
                }
            );
        }
    }

    updateParcelType(){
        if (this._selectedParcelType != undefined) {
            this._orderItem!.parcelTypeId = this._selectedParcelType!.id;
            this.orderItemService.updateOrderItem(this._orderItem! as IOrderItemEdit).then(
                response => {
                    if (response.statusCode == 204) {
                        console.log('success');
                    }
                }
            )
        }
    }
}
