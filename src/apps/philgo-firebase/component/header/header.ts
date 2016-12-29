import { Component, OnInit } from '@angular/core';
import {MEMBER_LOGIN , Member} from '../../api/philgo-api/v2/member';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: 'header.html'
})
export class HeaderComponent implements OnInit {

    login : MEMBER_LOGIN;
    constructor(
        private member : Member,
        private router : Router
    ) {
        this.login = member.getLoginData();
     }

    ngOnInit() { }

    onClickLogout(){

        let logout = confirm("Do you want to logout?");
        if(!logout) return;
        this.login = null;
        this.member.logout();
        this.router.navigate(['/']);
    }
}