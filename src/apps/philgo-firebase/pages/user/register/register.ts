import { Component, OnInit } from '@angular/core';
import { formProcess } from '../../../etc/share';
import { Member, MEMBER_DATA, MEMBER_REGISTER_DATA, MEMBER_LOGIN } from '../../../api/philgo-api/v2/member';

@Component({
    selector: 'register-page',
    templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
    title: string = "Register";

    login: MEMBER_LOGIN = null;
    memberData: MEMBER_DATA = null;
    
    form = < MEMBER_REGISTER_DATA > {};
    process = formProcess.reset();


    constructor(
        private member : Member

    ) { }

    ngOnInit() { }


    onClickRegister() {
        this.register();
    }

     register() {
        this.process.begin();
        this.form.nickname = this.form.name;
        this.member.register( this.form, (login) => {
            // register success
            console.log('onClickRegister(), registration sucess: ', login );
            //
        },
        e => {
            console.log("onClickRegister() error: " + e);
            setTimeout(()=>this.process.setError( e ),345);
        });
    }

}

