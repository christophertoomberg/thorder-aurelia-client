import { IFetchResponse } from 'types/IFetchResponse';
import { IOrderCreate } from './../domain/IOrderCreate';
import { HttpClient } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';
import { AppState } from 'state/app-state';
import { IOrder } from 'domain/IOrder';


@autoinject
export class ClientOrderSerice{

    constructor(private appState: AppState, private httpClient: HttpClient) {
        this.httpClient.baseUrl = this.appState.baseUrl;
    }

    async getMaxOpenOrder() : Promise<IFetchResponse<IOrder>>{
        try {
            const response = await this.httpClient.fetch(
                'order/activemax', {
                    cache: 'no-store',
                    headers: {
                        authorization: 'Bearer ' + this.appState.jwt
                    }
                }
            );

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IOrder;
                return {
                    statusCode: response.status,
                    data: data
                };
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

    async createOrder(order: IOrderCreate){
        try {
            const response = await this.httpClient.post(
                'order' , JSON.stringify(order) ,{
                    cache: 'no-store',
                    headers: {
                        authorization: 'Bearer ' + this.appState.jwt
                    }
                }
            );

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IOrder
                return {
                    statusCode: response.status,
                    data: data
                };
            }

            return {
                statusCode: response.status,
                errorMessage: response.statusText
            }
        }
        catch(reason) {
            return {
                statusCode: 0,
                errorMessage: JSON.stringify(reason)
            };
        }
    
    } 
}
