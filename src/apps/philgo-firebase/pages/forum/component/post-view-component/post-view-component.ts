import { Component, OnInit, Input } from '@angular/core';
import { POST } from '../../../../api/philgo-api/v2/philgo-api-interface';
import { Post } from '../../../../api/philgo-api/v2/post';

@Component({
    selector: 'post-view-component',
    templateUrl: 'post-view-component.html'
})
export class PostViewComponent implements OnInit {
    isPost: boolean = false;
    isComment: boolean = false;
    
    @Input() post : POST = null;



    constructor(
        private postService : Post
    ) { }

    ngOnInit() { 
        try {
            if ( this.post === null ) return alert("View Component Error: post is null");
            if ( this.post.idx_parent !== void 0 ) {
                this.isPost = this.post.idx_parent == '0';
                this.isComment = ! this.isPost;
            }
            else {
                // alert("ViewComponent::ngOnInit() no post.idx_parent");
            }
        }
        catch ( e ) {
            console.info("CATCH : ViewComponent::ngOnInit() idx_parent failed?");
        }


    }



    // onClickReply() {
    //     this.active = true;
    //     this.mode = 'create-comment';
    //     this.editComponent.initForm( this.mode );
    // }

    // onClickEdit() {
    //     console.log("ViewComponent::onClickEdit()", this.editComponent );
    //     this.active = true;
    //     this.hideContent = true;
    //     if ( this.post.idx == '0' ) this.mode = 'post-edit';
    //     else this.mode = 'edit-comment';
    //     this.editComponent.initForm( this.mode );
    // }

    onClickDelete() {
        this.post['inDeleting'] = true;
        this.postService.delete( this.post.idx, re => {
            console.log('delete: re: ', re);
            this.post.subject = "deleted";
            this.post.content = "deleted";
           
            },
            error => alert("delete error: " + error ),
            () => this.post['inDeleting'] = false
        );
    }
    

    onClickReport() {
        //console.log("onClickReport()");
        //this.post.debug = true;
        this.post['inReport'] = true;
        this.postService.report( this.post.idx, re => {
            // console.log('delete: re: ', re);
            alert("You have reported a post. Thank you.");
        },
        error => alert("report error: " + error ),
        () => {
            this.post['inReport'] = false;
        });
    }


    onClickLike() {
        this.post['inLike'] = true;
        this.postService.vote( this.post.idx, re => {
            console.log('delete: re: ', re);
            // alert("You have reported a post. Thank you.");
             this.post['inLike'] = false;
            this.post.good = (parseInt( this.post.good ) + 1).toString();
        },
        error => {

            alert("like error: " + error );
              this.post['inLike'] = false;
            console.log("like error: " + error );
        },
        () => {
            this.post['inLike'] = false;
        });
    }
}