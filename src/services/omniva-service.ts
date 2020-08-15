import { IFetchResponse } from './../types/IFetchResponse';
import { HttpClient } from 'aurelia-fetch-client';
import { AppState } from 'state/app-state';
import { autoinject } from 'aurelia-framework';
import { IOmnivaParcelMachine } from 'domain/IOmnivaParcelMachine';
@autoinject

export class OmnivaService{
    constructor(private appState: AppState,
                private httpClient: HttpClient){
        this.httpClient.baseUrl = this.appState.baseUrl;
    }

    async getParcelMachines(): Promise<IFetchResponse<IOmnivaParcelMachine[]>> {
        try {
            const response = await this.httpClient.fetch(
                'omnivaparcelmachine', {
                    cache: 'no-store',
                    headers: {
                        authorizations: 'Bearer ' + this.appState.jwt
                    }
                }
            );
            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IOmnivaParcelMachine[];
                return {
                    statusCode: response.status,
                    data: data!
                };
            }
            return{
                statusCode: response.status,
                errorMessage: response.statusText
            };
        } catch(reason) {
            return {
                statusCode: 0,
                errorMessage: JSON.stringify(reason)
            };
        }
    }
}
