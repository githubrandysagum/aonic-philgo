import { NgModule } from '@angular/core';
import { LoginPage } from './pages/user/login/login';
import { PhilgoApiModule } from './api/philgo-api/v2/philgo-api-module';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


const appRoutes: Routes = [
  { path: '', component: LoginPage }
];


@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        PhilgoApiModule,
        RouterModule.forRoot( appRoutes )
    ],
    exports: [],
    declarations: [LoginPage],
    providers: [
        

    ],
})
export class PhilgoFirebaseModule { }
