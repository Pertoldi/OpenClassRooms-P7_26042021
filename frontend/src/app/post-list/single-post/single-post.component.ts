import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {

  @Input() postAuthor!: string[]
	@Input() postTitle!: string
	@Input() postDate!: Date
	@Input() postUrl!: string
  @Input() postDescription!: string
  @Input() postLikes!: number
  @Input() postNbCommentaires!: number

  constructor() { }

  ngOnInit(): void {
    
    console.log(this.postUrl);
    
  }

}
