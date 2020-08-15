import { OrderService } from './../../services/order-service';
import { IOrderItemCreate } from './../../domain/IOrderItemCreate';
import { CommentService } from './../../services/comment-service';
import { UserDiscountCodeService } from './../../services/user-discount-code-service';
import { AlertType } from './../../types/AlertType';
import { IAlertData } from './../../types/IAlertData';
import { Router, RouteConfig, NavigationInstruction } from 'aurelia-router';
import { IOrder } from 'domain/IOrder';
import { ClientOrderSerice } from './../../services/client-order-service';
import { AppState } from './../../state/app-state';
import { autoinject } from 'aurelia-framework';
import { ScraperService } from 'services/scraper-service';
import { IScraperResponse } from 'domain/IScraperResponse';
import { PaymentService } from 'services/payment-service';
import { OrderItemService } from 'services/orderitem-service';
import { ICommentCreate } from 'domain/ICommentCreate';
import { IUserDiscountCodeEdit } from 'domain/IUserDiscountCodeEdit';
import { IUserDiscountCode } from 'domain/IUserDiscountCode';
import { format } from 'date-fns';
import { OmnivaService } from 'services/omniva-service';
import { IOmnivaParcelMachine } from 'domain/IOmnivaParcelMachine';


@autoinject
export class HomeIndex {

    private _itemLink: string = "";

    private _orderItems: Array<IScraperResponse> = [];

    private _isDataLoaded: boolean = true;

    private _isCodeResponseLoaded: boolean = true;

    private _totalPrice: number = 0;

    private _feeFromPrice: number = 0;

    private _address: string = "";

    private _order?: IOrder;

    private _discountCode?: IUserDiscountCode;
    private _discountCodeAlert: IAlertData | null = null;
    private _enteredCode: string = "";

    private _commentIndex?: number;
    private _commentText: string = "";

    private _itemQuantity: string = "";

    private _alert: IAlertData | null = null;

    private _parcelMachines: IOmnivaParcelMachine[] = [];
    private _selectedParcelMachine?: IOmnivaParcelMachine;

    public _pickup: boolean = false;

    constructor(private scraperService: ScraperService,
        private orderItemService: OrderItemService,
        private clientOrderService: ClientOrderSerice,
        private router: Router,
        private userDiscountCodeService: UserDiscountCodeService,
        private commentService: CommentService,
        private omnivaService: OmnivaService,
        private orderService: OrderService,
        private appState: AppState
    ) {

    }

    attached() {
        this.clientOrderService.getMaxOpenOrder().then(
            response => {
                if (response.statusCode == 200) {
                    this._order = response.data as IOrder;
                    this._alert = null;
                    console.log(response);
                }
            }
        );

        this.omnivaService.getParcelMachines().then(
            response => {
                if (response.statusCode == 200) {
                    this._parcelMachines = response.data!
                }

            }
        );
    }

    onSubmit(event: Event) {
        event.preventDefault();

        let discount = 0;

        if (this._discountCode != undefined) {
            discount = this.getTotalPrice() * this._discountCode!.discountMultiplier;
        }

        // Create order items.
        for (let item of this._orderItems) {
            let finalAddress = "";
            if (this._pickup) {
                finalAddress = 'J. Poska 7, Tallinn';
            } else if (this._selectedParcelMachine != null) {
                finalAddress = this._selectedParcelMachine.parcelMachineName;
            } else {
                this._alert = {
                    message: 'Please supply a delivery location.',
                    type: AlertType.Danger,
                    dismissable: true
                }
                return 1;
            }

    
            this.orderItemService
                .createOrderItem({
                    orderItemURL: item.orderItemURL,
                    orderItemPictureURL: item.orderItemPictureURL,
                    orderItemName: item.orderItemName,
                    orderItemPrice: item.orderItemPrice,
                    orderItemQuantity: item.quantity!,
                    fee: this.getTotalPrice() * 0.02,
                    parcelTypeId: '07e753ff-a02e-47ed-e131-08d839188b99',
                    totalPrice: this.getTotalPrice() - discount,
                    deliveryLocation: finalAddress,
                    orderId: this._order!.id,
                    paymentId: '49b358f4-7edc-4588-ae7f-08d83c547907',
                    orderDate: format(new Date(), 'MMMM do, yyyy')
                } as IOrderItemCreate).then(
                    response => {
                        if (response.statusCode >= 200 && response.statusCode < 300) {

                            // Add item comment.
                            if (item.comment! != "") {
                                this.commentService.createComment({
                                    commentText: item.comment!,
                                    orderItemId: response.data!.id
                                }).then();
                            }

                            localStorage.removeItem('order');
                            this.router.navigateToRoute('orderitems-index');
                        } else if (response.statusCode == 401) {
                            this._alert = {
                                message: 'Please log out and then in again to start ordering.',
                                type: AlertType.Danger,
                                dismissable: true
                            }
                        }
                    }
                );

            // Update info about discount code, if any.
            if (this._discountCode != undefined) {
                try {
                    if (this._discountCode.codeAmount == 1) {
                        this._discountCode!.codeIsUsed! = true;
                    } else {
                        this._discountCode!.codeAmount--;
                    }

                    this.userDiscountCodeService.updateUserDiscountCode(this._discountCode!).then(
                        response => {
                            if (response.statusCode == 200) {
                            } else if (response.statusCode == 401) {
                                this._alert = {
                                    message: 'Please log out and then in again to start ordering.',
                                    type: AlertType.Danger,
                                    dismissable: true
                                }
                            }
                        }
                    );
                } catch (reason) {
                }
            }

            // Update order info
            const orderOldCurrentSum = this._order!.orderCurrentSum;
            this._order!.orderCurrentSum = this._totalPrice! + orderOldCurrentSum;
            this.orderService.updateOrder(this._order!).then();
        }
    }


    pushItemData(event: Event) {
        this._isDataLoaded = false;
        event.preventDefault();
        this.scraperService.getProductInfo(this._itemLink).then(
            response => {
                if (response.statusCode == 200) {
                    response.data!.quantity = 1;
                    this._orderItems.push(response.data! as IScraperResponse);
                    this._itemLink = "";
                    this._totalPrice = this.getTotalPrice();
                    this._feeFromPrice = this.getTotalPrice() * 0.02;
                    this._isDataLoaded = true;
                } else {
                    this._isDataLoaded = true;
                }

                this._itemLink = "";
            }
        );
    }


    addCommentToOrderItem() {
        try {
            let orderItem = this._orderItems[this._commentIndex!];
            orderItem.comment! = this._commentText!;
            this._commentText = "";
        } catch (reason) {
        }
    }

    setItemQuantity(index: number) {
        this._orderItems[index].quantity = parseInt(this._itemQuantity!);
        this._totalPrice = this.getTotalPrice();
        this._feeFromPrice = this.getTotalPrice() * 0.02;
    }


    setCommentIndex(index: number) {
        try {
            this._commentIndex = index;
        } catch (reason) {
        }
    }

    removeItem(index: number) {
        try {
            this._orderItems.splice(index, 1);
            this._totalPrice = this.getTotalPrice();
            this._feeFromPrice = this.getTotalPrice() * 0.02;
            this._totalPrice = this.getTotalPrice();
        } catch (reason) {
        }
    }

    getTotalPrice(): number {
        let sum = 0;
        this._orderItems.forEach(item => {
            sum = sum + item.quantity! * item.orderItemPrice!;
        });
        return sum;
    }

    getDicountCode(name: string) {
        this._isCodeResponseLoaded = false;
        this.userDiscountCodeService.getDiscountCodeByName(name).then(
            response => {
                if (response.statusCode == 200) {
                    this._discountCode = response.data!;
                    this._discountCodeAlert = null;
                    this._isCodeResponseLoaded = true;

                } else {
                    this._isCodeResponseLoaded = true;
                    this._discountCodeAlert = {
                        message: 'Code ' + name + ' not found',
                        dismissable: true,
                        type: AlertType.Danger
                    }
                }
            }
        );
    }
}
