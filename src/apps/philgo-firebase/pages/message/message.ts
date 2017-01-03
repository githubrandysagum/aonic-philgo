import { Component, OnInit, Renderer } from '@angular/core';
import { Message, MESSAGE, MESSAGES, MESSAGE_LIST, MESSAGE_FORM } from '../../api/philgo-api/v2/message';
import { Member  } from '../../api/philgo-api/v2/member';
import { Router } from '@angular/router';
import { formProcess } from '../../etc/share';
import * as _ from 'lodash';

@Component({
    selector: 'app-message',
    templateUrl: 'message.html'
})
export class MessagePage implements OnInit {
     messages: MESSAGES = [];
     form: MESSAGE_FORM = <MESSAGE_FORM> {};
     showSearchForm: boolean = false;
     showCreateForm: boolean = false;
     key: string = null;
     page_no : number = 0;
     scrollListener = null;
     scrollCount = 0;
     inPageLoading: boolean = false; // true while loading a page of posts.
     noMorePosts: boolean = false; // true when there are no more posts of a page.

     process = formProcess.reset();

    constructor(
        private member : Member, 
        private message : Message,
        private renderer: Renderer,
        private router : Router
    ) { 
       this.beginScroll();


       if(this.member.getLoginData()){
            this.getMessages();
        }else{
            alert('Login first')
            this.goToLogin();
        }  
       
    }

    goToLogin(){
         this.router.navigate(['/user/login']);
    }
    ngOnInit() { }

     onClickShowContent(message : MESSAGE){
        message['show_content'] = true;  
        
        if ( message.stamp_open != "0" ) return;
        this.message.opened( message.idx, data => {
            console.log("onClickShowContent() : data: ", data);
            message.stamp_open = "1";
        },
        error => alert("error on reading: " + error ),
        () => {}
        );
    }

    onClickHideContent(message : MESSAGE){
        message['show_content'] = false;
    }
    
    onClickReply(message : MESSAGE){
         message['showReplyForm'] = true;
         this.showCreateForm = false;
    }

    onClickCreateFormSubmit() {
        this.process.begin()
        this.message.send( this.form, re => {
            console.log("message send success: ", re);
            this.process.setSuccess("message send success: ");
           setTimeout(()=> this.showCreateForm = false, 2000);
            if( re.code == 0 ) {
              //alert("Message successfully sent to " + this.form.id_recv);
              this.form.id_recv = '';
              this.form.content = '';
            }
        },
        error => this.process.setError("message sending error: " + error ),
        () => { }
        );
    }

    onClickSearchFormSubmit() {
        if ( this.showSearchForm === false ) {
            this.showSearchForm = true;
            return;
        }

        //this.data = <MESSAGE_LIST>{};
        //this.message.debug = true;if

        if(this.noMorePosts){
            this.noMorePosts = false;
            this.beginScroll();
        }
        this.page_no = 0;
        this.messages = [];
        this.getMessages( this.key );
    }



    onClickDelete( message: MESSAGE ) {
        let re = confirm("Do you want to delete this message?");
        if ( ! re ) return;
        this.message.delete( message.idx, re => {
            console.log("message delete success: ", re);
            message.idx = null;
        },
        error => alert("error on message delete: " + error ),
        () => {} );
    }





    onClickReplyFormSubmit( message: MESSAGE ) {
        console.log("onClickReplyFormSubmit(): ", message);
        this.form.id_recv = message.from.id;
        this.message.send( this.form, data => {
            console.log("reply sucess: ", data);
            message['showReplyForm'] = false;
        },
        error => alert("error on reply: " + error),
        () => {} );
     }





     onClickMakeAllRead() {
        this.message.makeAllRead( re => {
            console.log("make all read sucess: ", re);
            //this.data = <MESSAGE_LIST>{};
            this.messages = [];
            this.page_no = 0;

            if(this.noMorePosts){
                this.noMorePosts = false;
                this.beginScroll();
            }
            
            this.getMessages();
        },
        error => alert("error on make all read: " + error),
        () => {} );
    }





     beginScroll() {
      this.scrollListener = this.renderer.listenGlobal( 'document', 'scroll', _.debounce( () => this.pageScrolled(), 50));
    }



    endScroll() {
      this.scrollListener();
    }



    pageScrolled() {
      console.log("scrolled:", this.scrollCount++);
      let pages = document.querySelector(".pages");
      if ( pages === void 0 || ! pages || pages['offsetTop'] === void 0) return; // @attention this is error handling for some reason, especially on first loading of each forum, it creates "'offsetTop' of undefined" error.
      let pagesHeight = pages['offsetTop'] + pages['clientHeight'];
      let pageOffset = window.pageYOffset + window.innerHeight;
      if( pageOffset > pagesHeight - 200) { // page scrolled. the distance to the bottom is within 200 px from
        console.log("page scroll reaches at bottom: pageOffset=" + pageOffset + ", pagesHeight=" + pagesHeight);
        this.getMessages();
      }
    }



    ngOnDestroy() {
      this.endScroll();
    }




     getMessages( key = '' ) {
       this.inPageLoading = true;
     
        this.message.list( { key: key, page_no: ++this.page_no }, ( data: MESSAGE_LIST ) => {
            console.log("this.message.list() data: ", data);
           this.inPageLoading = false;
            if ( data.messages.length == 0 ) {
             this.noMorePosts = true;
             this.endScroll();
              return;
            }

           if ( data.messages.length == 0 ) return;
             this.lazyProcess(data);
        },
        error => {
         this.inPageLoading = false;
          if ( error == 'http-request-error maybe no-internet or wrong-domain or timeout or server-down' ) {
            alert("You have no internet.");
          }
          else alert("error:" + error);

          
        },
        () => {
            console.log("message list complete");
        });
      console.log("messages::", this.messages);
    }





    lazyProcess( data: MESSAGE_LIST ) {

       this.processMessageDate(data);
        // this.data.messages = [];
        data.messages.map( ( v, i ) => {
                setTimeout( () => {
                    this.messages.push( v );            
                }, i * 50 );
        } );
     }




      processMessageDate(data: MESSAGE_LIST){
            data.messages.map( message  => {
                message['date_created'] = this.getDate( message['stamp_created'] );
                console.log('stamp', message['stamp_created'] )
            });
     }





     getDate( stamp ) {
            let m = parseInt(stamp) * 1000;
            let d = new Date( m );

            let date: string;
            date = d.getFullYear() + "-";
            date += this.addZero(d.getMonth()) + "-";
            date += this.addZero(d.getDate()) + " ";
            date += this.addZero(d.getHours()) + ":";
            date += this.addZero(d.getMinutes());

            return date;
     }





    addZero(i : number){
        return i >= 10 ? i : "0" + i;
    }




}