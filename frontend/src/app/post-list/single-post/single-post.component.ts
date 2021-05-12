import { Component, Injectable, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
	selector: 'app-single-post',
	templateUrl: './single-post.component.html',
	styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {

	@Input() postFirstName!: string
	@Input() postLastName!: string
	@Input() postUserUrl!: string
	@Input() postTitle!: string
	@Input() postDate!: Date
	@Input() postUrl!: string
	@Input() postDescription!: string
	@Input() postLikes!: number
	@Input() userId!: number
	@Input() postId!: number

	messageForm!: FormGroup

	messages: any = []
	postNbCommentaires: number = 0

	isMyPost: boolean = false
	//TODO une variable isAdmin qui va requeter le serveur pour savoir si 'utilisateur est admin

	constructor(private postsService: PostsService, private router: Router, private messagesService: MessagesService, private formBuilder: FormBuilder) { }

	ngOnInit(): void {
		let localId: string = <string>sessionStorage.getItem('userId')
		if (parseInt(localId) == this.userId) {
			this.isMyPost = true
		}
		this.getMessages(this.postId)
		this.initForm()
	}

	initForm() {
		this.messageForm = this.formBuilder.group({
			message: [null, Validators.required]
		})
	}

	onPostSetting(elem: HTMLElement) {//TODO changer le display avec un changement de classe
		if (elem.classList.contains("display-post-settings")) {
			elem.classList.remove("display-post-settings")
		} else {
			elem.classList.add("display-post-settings")
		}
	}

	onModify() {
		this.router.navigate([`post-list/post-modify/${this.postId}`])
	}

	onDelete() {
		if (confirm('Etes vous sur de vouloir supprimer ce post ?')) {
			this.postsService.deletePost(this.postId)
		}
	}

	getMessages(postId: number) {
		this.messagesService.getMessages(postId).then(
			(res) => {
				for (let message of res.results) {
					this.messages.push(message)
					this.postNbCommentaires += 1
				}
			}
		)
	}

	onSubmit() {

	}

}
