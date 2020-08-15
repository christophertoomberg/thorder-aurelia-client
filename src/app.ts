import { AppState } from './state/app-state';
import { PLATFORM } from 'aurelia-pal';
import { autoinject } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';

@autoinject
export class App {

    router?: Router;
    constructor(private appState: AppState) {
    }
    configureRouter(config: RouterConfiguration, router: Router): void {
        this.router = router;

        config.title = "Ordering system"; 

        config.map([
            { route: ['account/login'], name: 'account-login', moduleId: PLATFORM.moduleName('views/account/login'), nav: false, title: 'Login' },
            { route: ['account/register'], name: 'account-register', moduleId: PLATFORM.moduleName('views/account/register'), nav: false, title: 'Register' },

            {route: ['orderitems','orderitems/index'], name: 'orderitems-index', moduleId: PLATFORM.moduleName('views/orderitems/index'), nav: false, title: 'My orders'},
            {route: ['orderitems/details/:id'], name: 'orderitem-details', moduleId: PLATFORM.moduleName('views/orderitems/details'), nav: false, title: 'Details'},
            {route: ['orderitems/edit/:id'], name: 'orderitem-edit', moduleId: PLATFORM.moduleName('views/orderitems/edit'), nav: false, title: 'Edit orderitem'},


            {route: ['orders','orders/index'], name: 'orders-index', moduleId: PLATFORM.moduleName('views/orders/index'), nav: false, title: 'All orders'},
            {route: ['orders/details/:id'], name: 'order-details', moduleId: PLATFORM.moduleName('views/orders/details'), nav: false, title: 'Order details'},
            {route: ['orders/edit/:id'], name: 'order-edit', moduleId: PLATFORM.moduleName('views/orders/edit'), nav: false, title: 'Edit order'},

            {route: ['faq'], name: 'faq', moduleId: PLATFORM.moduleName('views/home/faq.html'), nav: true, title: 'FAQ'},
            { route: ['/','home', 'home/index'], name: 'home', moduleId: PLATFORM.moduleName('views/home/index'), nav: false, title: 'Home' }
            ]);

        config.mapUnknownRoutes('home');
    }

    logoutOnClick() {
        this.appState.clearUserData();
        this.router!.navigateToRoute('account-login');
    }
}
