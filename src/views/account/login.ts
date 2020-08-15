import { Router } from 'aurelia-router';
import { AppState } from './../../state/app-state';
import { autoinject } from 'aurelia-framework';
import { AccountService } from '../../services/account-service';


@autoinject
export class AccountLogin {

    private _email: string = "";
    private _password: string = "";
    private _errorMessage: string | null = null;

    constructor(private accountService: AccountService, private appState: AppState, private router: Router) {
    }

    onSubmit(event: Event) {
        event.preventDefault();

        this.accountService.login(this._email, this._password).then(
            response => {
                if (response.statusCode == 200) {
                    this.appState.userData = response.data!.token;
                    this.router!.navigateToRoute('home');
                } else {
                    this._errorMessage = 'User not found'
                }
            }
        );
    }

}
