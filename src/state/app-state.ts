export class AppState {
    constructor() {
    }

    public readonly baseUrl = 'https://thorder.azurewebsites.net/api/v1/';


    // JavaScript Object Notation Web Token 
    // to keep track of logged in status
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
    get jwt(): string | null {
        return localStorage.getItem('jwt');
    }

    get userName(): string | null {
        return localStorage.getItem('userFullName');
    }

    get userRole(): string | null {
        let jwt = localStorage.getItem('jwt');
        if (jwt != undefined) {
            let parsed = this.dataFromJwt(jwt!);
            try {
                let jwtData = JSON.parse(parsed)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"][1];
                return jwtData;
            } catch (reason) {
                return null;;
            }
        }
        return null;
    }

    set userData(value: string | null) {
        if (value) {
            localStorage.setItem('jwt', value);
            let jwtData = this.dataFromJwt(value);
            let fullName = JSON.parse(jwtData)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] + ' ' +
                JSON.parse(jwtData)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
            localStorage.setItem('userFullName', fullName);
        }
    }

    clearUserData() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userFullName');
    }

    dataFromJwt(token: string): string {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return jsonPayload;
    }
}
