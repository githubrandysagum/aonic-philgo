import { Component, OnInit, Input } from '@angular/core';
import { POST } from '../../../../api/philgo-api/v2/philgo-api-interface';
@Component({
    selector: 'post-view-component',
    templateUrl: 'post-view-component.html'
})
export class PostViewComponent implements OnInit {
    @Input() post : POST = null;
    constructor() { }

    ngOnInit() { }
}