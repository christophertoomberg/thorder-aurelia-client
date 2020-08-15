import { IOrderItemEdit } from './../domain/IOrderItemEdit';
import { IFetchResponse } from './../types/IFetchResponse';
import { IOrderItem } from './../domain/IOrderItem';
import { HttpClient, json } from 'aurelia-fetch-client';
import { AppState } from './../state/app-state';
import { autoinject } from 'aurelia-framework';
import { IOrderItemCreate } from 'domain/IOrderItemCreate';
import { data } from 'jquery';
@autoinject
export class OrderItemService {
    constructor(private appState: AppState,
        private httpClient: HttpClient) {
        this.httpClient.baseUrl = this.appState.baseUrl;
    }


async getOrderItemsForUser(): Promise<IFetchResponse<IOrderItem[]>> {
        try {
            const response = await this.httpClient.fetch(
                'orderitem', {
                cache: 'no-store',
                headers: {
                    authorization: 'Bearer ' + this.appState.jwt
                }

            }
            );

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IOrderItem[];
                return {
                    statusCode: response.status,
                    data: data
                };
            }

            return {
                statusCode: response.status,
                errorMessage: response.statusText
            }

        } catch (reason) {
            return {
                statusCode: 0,
                errorMessage: JSON.stringify(reason)
            };
        }
    }


    async getOrderItemsForOrder(orderId: string): Promise<IFetchResponse<IOrderItem[]>> {
        try {
            const response = await this.httpClient.fetch(
                'orderitem/fororder/' + orderId, {
                cache: 'no-store',
                headers: {
                    authorization: 'Bearer ' + this.appState.jwt
                }
            }
            );

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IOrderItem[];
                return {
                    statusCode: response.status,
                    data: data
                };
            }

            return {
                statusCode: response.status,
                errorMessage: response.statusText
            }

        } catch (reason) {
            return {
                statusCode: 0,
                errorMessage: JSON.stringify(reason)
            };
        }
    }


    async getOrderItem(id: string) {
        try {
            const response = await this.httpClient
                .fetch('orderitem/' + id, {
                    cache: 'no-store',
                    headers: {
                        authorization: 'Bearer ' + this.appState.jwt
                    }

                });

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IOrderItem;
                return {
                    statusCode: response.status,
                    data: data
                }
            }

            return {
                statusCode: response.status,
                errorMessage: response.statusText
            }

        } catch (reason) {
            return {
                statusCode: 0,
                errorMessage: JSON.stringify(reason)
            }
        }
    }

    async createOrderItem(orderItem: IOrderItemCreate) {
        try {
            const response = await this.httpClient
                .post('orderitem', JSON.stringify(orderItem), {
                    cache: 'no-store',
                    headers: {
                        authorization: 'Bearer ' + this.appState.jwt
                    }
                })

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IOrderItem
                return {
                    statusCode: response.status,
                    data: data
                }
            }

            return {
                statusCode: response.status,
                errorMessage: response.statusText
            }
        }
        catch (reason) {
            return {
                statusCode: 0,
                errorMessage: JSON.stringify(reason)
            }
        }
    }

    async updateOrderItem(orderItem: IOrderItemEdit) {
        try {
            const response = await this.httpClient
                .put('orderitem/' + orderItem.id, JSON.stringify(orderItem), {
                    cache: 'no-store', 
                    headers: {
                        authorization: 'Bearer ' + this.appState.jwt
                    }
                });

            if (response.status >= 200 && response.status < 300) {
                return {
                    statusCode: response.status
                }
            }
            return {
                statusCode: response.status,
                errorMessage: response.statusText
            }
        }
        catch (reason) {
            return {
                statusCode: 0,
                errorMessage: JSON.stringify(reason)
            }
        }
    }

}
