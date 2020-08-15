import { IFetchResponse } from './../types/IFetchResponse';
import { HttpClient } from 'aurelia-fetch-client';
import { AppState } from 'state/app-state';
import { autoinject } from 'aurelia-framework';
import { IComment } from 'domain/IComment';
import { ICommentCreate } from 'domain/ICommentCreate';

@autoinject
export class CommentService {
    constructor(private appState: AppState,
        private httpClient: HttpClient) {
        this.httpClient.baseUrl = this.appState.baseUrl;
    }

    async getComments(orderItemId: string): Promise<IFetchResponse<IComment[]>> {
        try {
            const response = await this.httpClient.fetch(
                'comment/for/' + orderItemId, {
                cache: 'no-store',
                headers: {
                    authorization: 'Bearer ' + this.appState.jwt
                }
            }
            );

            if (response.status >= 200 && response.status < 300) {
                const data = (await response.json()) as IComment[];
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

    async createComment(comment: ICommentCreate) {
        try {
            const response = await this.httpClient.post(
                'comment', JSON.stringify(comment), {
                cache: 'no-store',
                headers: {
                    authorization: 'Bearer ' + this.appState.jwt
                }
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
