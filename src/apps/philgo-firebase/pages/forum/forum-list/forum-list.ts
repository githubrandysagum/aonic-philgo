import { Component, OnInit, Renderer } from '@angular/core';
import { Post } from '../../../api/philgo-api/v2/post';
import { POST, POSTS, PAGE_OPTION, PAGE } from '../../../api/philgo-api/v2/philgo-api-interface';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'forum-list-page',
    templateUrl: 'forum-list.html'
})
export class ForumListPage implements OnInit {
    view : POST = null;
    posts: POSTS = <POSTS> [];
    post_id: string = '';
    page_no: number = 1;
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

         let option: PAGE_OPTION = {
            post_id: this.post_id,
            page_no: this.page_no++,
            limit: 10
        };
        // this.post.debug = true;
        this.post.page( option, (page: PAGE) => {
            this.delayPush(page);
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

    
   
}

