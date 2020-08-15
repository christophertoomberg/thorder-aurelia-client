import { IStore } from './../../domain/IStore';
import { autoinject } from 'aurelia-framework';
import { StoreService } from 'services/store-service';
import { IAlertData } from 'types/IAlertData';
import { AlertType } from './../../types/AlertType';


@autoinject 
export class StoresIndex {
    private _stores: IStore[] = [];
    
    private _alert: IAlertData | null = null;


    constructor(private storeService: StoreService){
        
    }  
 
    attached() {
        this.storeService.getStores().then(
            response => {
                console.log(response);
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    this._alert = null;
                    this._stores = response.data!;
                 } else {
                    // show error message
                    this._alert = {
                        message: response.statusCode.toString() + ' - ' + response.errorMessage,
                        type: AlertType.Danger,
                        dismissable: true,
                    }
                }
            }
        );
    }

}


