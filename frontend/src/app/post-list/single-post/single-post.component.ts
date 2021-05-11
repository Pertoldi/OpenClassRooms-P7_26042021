import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
	@Input() postNbCommentaires!: number
	@Input() userId!: number
	@Input() postId!: number

	messages: any = []

	isMyPost: boolean = false
	//TODO une variable isAdmin qui va requeter le serveur pour savoir si 'utilisateur est admin

	constructor(private postsService: PostsService, private router: Router) { }

	ngOnInit(): void {
		let localId: string = <string>sessionStorage.getItem('userId')
		if (parseInt(localId) == this.userId) {
			this.isMyPost = true
		}
		this.getMessages(this.postId)
	}

	onPostSetting(_elem: HTMLElement) {//TODO changer le display avec un changement de classe
		_elem instanceof HTMLElement
		console.log(_elem instanceof HTMLElement)
		console.log(_elem instanceof Element)

		if (_elem.style.display == "none") {
			_elem.style.display = "flex"
		} else {
			_elem.style.display = "none"
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

	onFocusOut(_elem: HTMLElement) {
		this.onPostSetting(_elem)
	}

	getMessages(postId: number) {
		this.postsService.getMessages(postId).then(
			(res) => {
				console.log('first id dans le component is :', res.results[0].userId)
				for ( let message of res.results) {
					console.log('message is :', message)
					this.messages.push(message)
					console.log('messages is :', this.messages)
				}

			}
		)
	}

	//TODO une requete qui va demander les messge au serveur et les afficher grace au message component
}
