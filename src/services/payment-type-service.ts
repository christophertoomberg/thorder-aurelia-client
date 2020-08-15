import { HttpClient } from 'aurelia-fetch-client';
import { AppState } from 'state/app-state';
import { autoinject } from 'aurelia-framework';
import { IPaymentType } from 'domain/IPaymentType';
@autoinject
export class PaymentTypeService{
    constructor(private appState: AppState, private httpClient: HttpClient){
        this.httpClient.baseUrl = this.appState.baseUrl;
    }

    async getPaymentType(id: string) {
        try {
            const response = await this.httpClient
                .fetch('paymenttype/' + id, {
                    cache: 'no-store'
                });

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IPaymentType;
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
}
