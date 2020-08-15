import { IParcelType } from './../domain/IParcelType';
import { IFetchResponse } from './../types/IFetchResponse';
import { HttpClient } from 'aurelia-fetch-client';
import { AppState } from 'state/app-state';
import { autoinject } from 'aurelia-framework';
@autoinject
export class ParcelTypeService{
    constructor(private appState: AppState, private httpClient: HttpClient){
        this.httpClient.baseUrl = this.appState.baseUrl;
    }

    async getParcelTypes(): Promise<IFetchResponse<IParcelType[]>>{
        try {
            const response = await this.httpClient.fetch(
                'parceltype', {
                    cache: 'no-store'
                }
            );

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IParcelType[];
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
    async getParcelType(id: string) {
        try {
            const response = await this.httpClient
                .fetch('parceltype/' + id, {
                    cache: 'no-store'

                });

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IParcelType;
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
