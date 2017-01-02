import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../../../api/philgo-api/v2/post';
import { POST, POST_DATA } from '../../../../api/philgo-api/v2/philgo-api-interface';
import * as _ from 'lodash';

@Component({
    selector: 'edit-post-component',
    templateUrl: 'edit-post-component.html'
})
export class EditPostComponent implements OnInit {
    /**
     * This is needed to put newly created post on top of post list.
     */
    @Input() posts: any = null;
    /**
     * 'root' is the root post.
     *      - It is needed to 'create-comment'.
     *          - More specifically, it will be used to insert the created comment into view.
     *      - It is not needed on 'edit-comment' and post create/edit.
     * 
     */
    @Input() root: POST = null;
    /**
     *  @Attention - variable 'current' is the current post or current comment.
     * 
     *  If you want to reply of a post, 'current' is the post.
     *  If you want to edit post, 'current' is the post.
     *  If you want to reply of a comment, 'parent' is the comment you want to leave a comment on.
     *  If you want to edit a comment, 'current' is the comment.
     */
    @Input() post_id: string = null;
    @Input() current: POST;
    @Input() active: boolean = false; // adding '.show' CSS Class to FORM
    @Input() mode: 'create-post' | 'edit-post' | 'create-comment' | 'edit-comment';
    @Output() postLoad = new EventEmitter();
    @Output() error = new EventEmitter();
    @Output() success = new EventEmitter();
    @Output() cancel = new EventEmitter();

    
    showProgress: boolean = false;
    progress: number = 0;
    widthProgress: any;
    //files: Array<FILE_UPLOAD_DATA> = <Array<FILE_UPLOAD_DATA>>[];
    temp = <POST_DATA> {};
    
    cordova: boolean = false;
    inDeleting: boolean = false;
    inPosting: boolean = false;

    constructor(
         private postService: Post,
    ) { }

    ngOnInit() { 
        this.initForm();
    }


    initForm( mode? ) {
        if ( mode ) this.mode = mode;
        
        this.temp = <POST_DATA> {};
        this.temp.gid = this.postService.uniqid(); // generate new gid for new post/comment.

        //console.log("EditComponent::initForm() current: ", this.current);
        //console.log("mode: ", this.mode);
      

        if ( this.mode == 'edit-post' || this.mode == 'edit-comment' ) { //
            // console.log('without loading. mode: ', this.mode);
            this.temp = _.cloneDeep( this.current );
            this.temp.content = this.postService.strip_tags( this.temp.content );
        }
        
    }

    onActivateForm() {
        if ( this.active ) return; // active 할 때 마다, 내용을 초기화 하므로, 그냥 리턴한다.
        console.log("onActivateForm: ", this.temp);
        this.initForm( 'create-comment' ); // onActivateForm() 에서는 무조건 'create-comment' 를 하면 된다.
        this.active = true; // add CSS class
    }
    
    onClickCancel() {
        this.active = false;
        this.cancel.emit();
    }

}