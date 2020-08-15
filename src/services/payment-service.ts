import { HttpClient } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';
import { AppState } from 'state/app-state';
import { IPayment } from 'domain/IPayment';
import { IPaymentCreate } from 'domain/IPayentCreate';

@autoinject
export class PaymentService {
    constructor(private appState: AppState, private httpClient: HttpClient) {
        this.httpClient.baseUrl = this.appState.baseUrl;
    }

    async getPayments() {
        try {
            const response = await this.httpClient.fetch(
                'Payment', {
                    cache: 'no-store',
                    headers: {
                        authorization:'Bearer ' + this.appState.jwt
                    } 
                }
            );

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json() as IPayment);
                return {
                    statusCode: response.status,
                    data: data
                };
            }
        } catch (reason) {
            return {
                statusCode: 0,
                errorMessage: JSON.stringify(reason)
            };
        }
    }

    async getPayment(id: string) {
        try {
            const response = await this.httpClient
                .fetch('payment/' + id, {
                    cache: 'no-store', 
                    headers: {
                        authorization: 'Bearer ' + this.appState.jwt  
                    }

                });

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IPayment;
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

    async createPayment(payment: IPaymentCreate) {
        try {
            const response = await this.httpClient.post(
                'Payment', JSON.stringify(payment), {
                    cache: 'no-store',
                    headers: 'Bearer ' + this.appState.jwt
                }
            );

            if (response.status >= 200 && response.status < 300) {
                return {
                    statusCode: response.status
                };
            }

            return {
                statusCode: response.status,
                errorMessage: response.statusText
            };
        } catch (reason) {
            return {
                statusCode: 0,
                errorMessage: JSON.stringify(reason)
            };
        }
    }
}
