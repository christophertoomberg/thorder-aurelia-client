import { RouteConfig, NavigationInstruction } from 'aurelia-router';
import { IStore } from './../../domain/IStore';
import { autoinject } from 'aurelia-framework';
import { StoreService } from 'services/store-service';
import { IAlertData } from 'types/IAlertData';
import { AlertType } from 'types/AlertType';

@autoinject
export class StoresDetails {

    private _store?: IStore;
    private _alert: IAlertData | null = null;

    constructor(private storeService: StoreService){
    }  

    attached() {
        
    }

    activate(params: any, routeConfig: RouteConfig, navigationInstruction: NavigationInstruction) {
        console.log(params);
        if (params.id && typeof (params.id) == 'string') {
            this.storeService.getStore(params.id).then(
                response => {
                    if (response.statusCode >= 200 && response.statusCode < 300) {
                        this._alert = null;
                        this._store = response.data!;
                    } else {
                        // show error message
                        this._alert = {
                            message: response.statusCode.toString() + ' - ' + response.errorMessage,
                            type: AlertType.Danger,
                            dismissable: true,
                        }
                        this._store = undefined;
                    }
                }                
            );
        }
    }
}


