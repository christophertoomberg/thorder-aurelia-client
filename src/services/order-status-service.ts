import { IFetchResponse } from './../types/IFetchResponse';
import { IOrderStatus } from './../domain/IOrderStatus';
import { HttpClient } from 'aurelia-fetch-client';
import { AppState } from 'state/app-state';
import { autoinject } from 'aurelia-framework';
import { IOrderStatusCreate } from 'domain/IOrderStatusCreate';
@autoinject
export class OrderStatusService{
    constructor(private appState: AppState, private httpClient: HttpClient){
        this.httpClient.baseUrl = this.appState.baseUrl;
    }

    async getOrderStatuses(): Promise<IFetchResponse<IOrderStatus[]>> {
        try {
            const response = await this.httpClient.fetch(
                'orderstatus', {
                    cache: 'no-store'

                }
            );

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IOrderStatus[];
                return {
                    statusCode: response.status,
                    data: data
                };
            }

            return {
                statusCode: response.status,
                errorMessage: response.statusText
            }
            
        } catch(reason) {
            return {
                statusCode: 0,
                errorMessage: JSON.stringify(reason)
            };
        }
    }

    async getOrderStatus(id: string): Promise<IFetchResponse<IOrderStatus>>{
        try {
            const response = await this.httpClient
                .fetch('orderstatus/' + id, {
                    cache: 'no-store'

                });

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IOrderStatus;
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

    async updateOrderStatus(orderStatus: IOrderStatus) {
        try {
            const response = await this.httpClient
                .put('orderstatus/' + orderStatus.id, JSON.stringify(orderStatus), {
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

    async createOrderStatus(orderStatus: IOrderStatusCreate) {
        try {
            const response = await this.httpClient
                .post('orderstatus', JSON.stringify(orderStatus), {
                    cache: 'no-store', 
                    headers: {
                        authorization: 'Bearer ' + this.appState.jwt
                    }
                })

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

    async deleteOrderStatus(id: string) {
        try {
            const response = await this.httpClient
            .delete('orderstatus' + '/' + id, {
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
