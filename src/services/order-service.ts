import { IFetchResponse } from './../types/IFetchResponse';
import { IOrder } from './../domain/IOrder';
import { HttpClient } from 'aurelia-fetch-client';
import { AppState } from 'state/app-state';
import { autoinject } from 'aurelia-framework';
@autoinject
export class OrderService{
    constructor(private appState: AppState, private httpClient: HttpClient){
        this.httpClient.baseUrl = this.appState.baseUrl;
    }

    async getOrders(): Promise<IFetchResponse<IOrder[]>> {
        try {
            const response = await this.httpClient.fetch(
                'order', {
                    cache: 'no-store',
                    headers: {
                        authorization: 'Bearer ' + this.appState.jwt
                    }

                }
            );

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IOrder[];
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

    async getOrder(id: string){
        try {
            const response = await this.httpClient
                .fetch('order/' + id, {
                    cache: 'no-store', 
                    headers: {
                        authorization: 'Bearer ' + this.appState.jwt  
                    }

                });

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IOrder;
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

    async updateOrder(order: IOrder) {
        try {
            const response = await this.httpClient
                .put('order/' + order.id, JSON.stringify(order), {
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
    
    async deleteOrder(id: string) {
        try {
            const response = await this.httpClient
            .delete('order/' + id, {
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
