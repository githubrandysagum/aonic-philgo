import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { HomePage } from '../pages/home/home';
import { HelpPage } from '../pages/help/help';

import { PhilgoFirebaseModule } from '../apps/philgo-firebase/philgo-firebase-module';

const appRoutes: Routes = [
  { path: 'help', loadChildren: '../pages/help/help.module#HelpModule' },
  { path: '', component: HomePage }
];

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    HelpPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot( appRoutes ),
    PhilgoFirebaseModule
  ],
  bootstrap: [ AppComponent ],
  providers: [ ]
})
export class AppModule {}


