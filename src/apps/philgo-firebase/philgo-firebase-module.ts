import { NgModule } from '@angular/core';
import { PhilgoApiModule } from './api/philgo-api/v2/philgo-api-module';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { LoginPage } from './pages/user/login/login';
import { RegisterPage } from './pages/user/register/register';
import { HomePage } from './pages/home/home';

import { HeaderComponent} from './component/header/header';


const appRoutes: Routes = [
  { path: '', component: HomePage },
  { path: 'user/login', component: LoginPage },
  { path: 'user/register', component: RegisterPage }
  
  
];


@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        PhilgoApiModule,
        RouterModule.forRoot( appRoutes )
    ],
    exports: [],
    declarations: [
        LoginPage,
        RegisterPage,
        HomePage,
        HeaderComponent
        ],
    providers: [
        

    ],
})
export class PhilgoFirebaseModule { }
