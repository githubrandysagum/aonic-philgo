import { Component } from '@angular/core';
import { Member, MEMBER_LOGIN_DATA } from '../../../api/philgo-api/v2/member';
import { formProcess } from '../../../etc/share';


@Component({
    selector: 'login-page',
    templateUrl: 'login.html'
})


export class LoginPage {
    title: string = "Login";
    form = < MEMBER_LOGIN_DATA > {};
    process = formProcess.reset();

    error : string;
    loader : boolean;

    constructor(
        private member: Member,

    ) {
    }
    onClickLogin() {
        console.log("LoginPage::onClickLogin()");
        this.login();
    }

    login() {  
        this.process.startLoader();
        this.member.login( this.form,
            login => {
                console.log('philgo login success: ', login);        
            },
            er => {      
                console.log("philgo member.login error: ", er );  
                this.process.setError(er);  
            },
            () => {
                console.log('philgo login complete!');
                this.loader = false;
            }
        );
    }
  
}