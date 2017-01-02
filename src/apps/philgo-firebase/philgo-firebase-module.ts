import { NgModule } from '@angular/core';
import { PhilgoApiModule } from './api/philgo-api/v2/philgo-api-module';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { LoginPage } from './pages/user/login/login';
import { RegisterPage } from './pages/user/register/register';
import { HomePage } from './pages/home/home';
import { MessagePage } from './pages/message/message';
import { ForumIndexPage } from './pages/forum/forum-index/forum-index';
import { ForumListPage } from './pages/forum/forum-list/forum-list';

import { HeaderComponent} from './component/header/header';
import { PostViewComponent} from './pages/forum/component/post-view-component/post-view-component';

//File uploading
import { AngularFireModule } from 'angularfire2';
import { Data } from './data';

const appRoutes: Routes = [
  { path: '', component: HomePage },
  { path: 'user/login', component: LoginPage },
  { path: 'user/register', component: RegisterPage },
  { path: 'message', component: MessagePage },
  { path: 'forum', component: ForumIndexPage },
  { path: 'forum/:post_id', component: ForumListPage }
  
  
];
let config = {
    apiKey: "AIzaSyBnRU17u3RLZoFDkmvHL_gxNmvQxO9z5bA",
    authDomain: "philgofirebase.firebaseapp.com",
    databaseURL: "https://philgofirebase.firebaseio.com",
    storageBucket: "philgofirebase.appspot.com",
    messagingSenderId: "17096589698"
  };

@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        PhilgoApiModule,
        RouterModule.forRoot( appRoutes ),
        AngularFireModule.initializeApp(config) 
    ],
    exports: [],
    declarations: [
        LoginPage,
        RegisterPage,
        HomePage,
        MessagePage,
        ForumIndexPage,
        ForumListPage,
        HeaderComponent,
        PostViewComponent
        ],
    providers: [
        Data

    ],
})
export class PhilgoFirebaseModule { }
