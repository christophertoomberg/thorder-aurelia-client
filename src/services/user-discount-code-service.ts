import { IFetchResponse } from './../types/IFetchResponse';
import { HttpClient } from 'aurelia-fetch-client';
import { AppState } from 'state/app-state';
import { autoinject } from 'aurelia-framework';
import { IUserDiscountCode } from 'domain/IUserDiscountCode';
import { IUserDiscountCodeEdit } from 'domain/IUserDiscountCodeEdit';

@autoinject
export class UserDiscountCodeService {
    constructor(private appState: AppState,
        private httpClient: HttpClient) {
        this.httpClient.baseUrl = this.appState.baseUrl;
    }

    async getDiscountCodeByName(name: string): Promise<IFetchResponse<IUserDiscountCode>> {
        try {
            const response = await this.httpClient.fetch(
                'userdiscountcode/codename?name=' + name, {
                cache: 'no-store',
                headers: {
                    authorization: 'Bearer ' + this.appState.jwt
                }
            }
            );

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IUserDiscountCode;
                return {
                    statusCode: response.status,
                    data: data
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

    async updateUserDiscountCode(userDiscountCode: IUserDiscountCodeEdit) {
        try {
            const response = await this.httpClient.put(
                'userdiscountcode/' + userDiscountCode.id, JSON.stringify(userDiscountCode), {
                cache: 'no-store',
                headers: {
                    authorization: 'Bearer ' + this.appState.jwt
                }
            }
            );
            if (response.status >= 200 && response.status < 300) {
                return { statusCode: response.status };
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
