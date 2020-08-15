import { AppState } from './../state/app-state';
import { HttpClient } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';
import { IScraperResponse } from 'domain/IScraperResponse';


@autoinject
export class ScraperService {
    constructor (private httpClient: HttpClient, private appState: AppState){
        this.httpClient.baseUrl = this.appState.baseUrl
    }

    async getProductInfo(url: string) {
        try {

            const response = await this.httpClient.get('WebScraper/?url=' + url);

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IScraperResponse;
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
            }
        }
    }
}
