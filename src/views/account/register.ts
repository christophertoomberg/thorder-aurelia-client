import { Router, RouteConfig, NavigationInstruction } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { AccountService } from 'services/account-service';
import { AppState } from './../../state/app-state';
import {ValidationRules, ValidationController, ValidationControllerFactory } from 'aurelia-validation';


@autoinject
export class AccountRegister {

    private _email: string = "";
    private _password: string = "";
    private _firstName: string = "";
    private _lastName: string = "";
    _controller: ValidationController;


    constructor(private accountService: AccountService,
        private appState: AppState,
        private router: Router,
        controllerFactory: ValidationControllerFactory) {
            this._controller = controllerFactory.createForCurrentScope();

        /*
        ValidationRules
            .ensure(this._firstName)
            .required().withMessage('First name cannot be empty.')
            .minLength(1).withMessage('First name minimum length must be 1 character.')
            .maxLength(128).withMessage('First name length must not exceed 128 characters.')
            .ensure(this._lastName)
            .required().withMessage('Last name cannot be empty.')
            .minLength(1).withMessage('Last name minimum length must be 1 character.')
            .maxLength(128).withMessage('Last name length must not exceed 128 characters.')
            .ensure(this._email)
            .required().withMessage('Email cannot be empty.')
            .email().withMessage('Must be an email address.')
            .ensure(this._password)
            .required().withMessage('Password cannot be empty')
            .matches(new RegExp('(?=.*[a-z])(?=.*[#$^+=!*()@%&]).{6,}')).withMessage('Password must contain at least one lowercase character.')
            .matches(new RegExp('(?=.*[A-Z])')).withMessage('Password must contain at least one uppercase character.')
            .matches(new RegExp('(?=.*\d)')).withMessage('Password must contain at least one number.')
            .matches(new RegExp('(?=.*[#$^+=!*()@%&])')).withMessage('Password must contain at least one special character.')
            .matches(new RegExp('.{6,}')).withMessage('Password must be at least 6 characters long.')
            */
           ValidationRules
                .ensure(this._firstName).required().withMessage('req')
    }



    onSubmit(event: Event) {
        event.preventDefault();


        this.accountService.register(this._firstName, this._lastName, this._email, this._password).then(
            response => {
                console.log(response);
                if (response.statusCode == 200) {
                    this.router!.navigateToRoute('account-login');
                } else if (response.statusCode == 404) {
                    console.log(response);
                } else if (response.statusCode == 400) {
                    console.log(response);
                }
            }
        );
    }

    test() {
        console.log(this._controller!.errors)

        this._controller?.errors.forEach(element => {
            element.message
        });
    }
     
}
