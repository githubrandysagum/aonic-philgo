import { Component, OnInit, Renderer } from '@angular/core';
import { Post } from '../../../api/philgo-api/v2/post';
import { POST, POSTS, PAGE_OPTION, PAGE } from '../../../api/philgo-api/v2/philgo-api-interface';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

@Component({
    selector: 'forum-list-page',
    templateUrl: 'forum-list.html'
})
export class ForumListPage implements OnInit {
    view : POST = null;
    posts: POSTS = <POSTS> [];
    post_id: string = '';
    page_no: number = 1;

    noMorePosts = false;
    scrollListener = null;
    scrollCount = 0;
    inPageLoading: boolean = false; // true while loading a page of posts.

    constructor(
        private post: Post,
                 activated: ActivatedRoute,
                 private renderer: Renderer) {

            activated.params.subscribe( param => {
                this.posts = <POSTS> [];
                this.post_id =  param['post_id']
                this.loadPage();
          } );
     }

    ngOnInit() { }

    loadPage(){
      if ( this.inPageLoading ) {
        console.info("in page loading");
        return;
      }
      this.inPageLoading = true;


         let option: PAGE_OPTION = {
            post_id: this.post_id,
            page_no: this.page_no++,
            limit: 10
        };
        // this.post.debug = true;
        this.post.page( option, (page: PAGE) => {
            console.log("Page: ", page);
            this.inPageLoading = false;
            if ( page.posts.length == 0 ) {

                alert('nomorepost')
              this.noMorePosts = true; }
            else {
                this.delayPush( page );
            }
           
        }, error => alert("Error:" + error))

    }

    delayPush( page:PAGE ) {
        let posts = page.posts;
        console.log("Page:",page)
        posts.map( ( v, i ) => {
            setTimeout( () => {
                this.posts.push ( v );
            },
            100 + i * 50 );
        });
    }


    beginScroll() {
      this.scrollListener = this.renderer.listenGlobal( 'document', 'scroll', _.debounce( () => this.pageScrolled(), 50));
    }
    endScroll() {
        if ( this.scrollListener ) this.scrollListener();
    }
    pageScrolled() {
      console.log("scrolled:", this.scrollCount++);
      let pages = document.querySelector(".pages");
      if ( pages === void 0 || ! pages || pages['offsetTop'] === void 0) return; // @attention this is error handling for some reason, especially on first loading of each forum, it creates "'offsetTop' of undefined" error.
      let pagesHeight = pages['offsetTop'] + pages['clientHeight'];
      let pageOffset = window.pageYOffset + window.innerHeight;
      if( pageOffset > pagesHeight - 200) { // page scrolled. the distance to the bottom is within 200 px from
        console.log("page scroll reaches at bottom: pageOffset=" + pageOffset + ", pagesHeight=" + pagesHeight);
        this.loadPage();
      }
    }
    ngOnDestroy() {
      this.endScroll();
    }

    
   
}

