import { Component, Injectable, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LikesService } from 'src/app/services/likes.service';
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
	@Input() postUserId!: number
	@Input() postId!: number

	messageForm!: FormGroup

	messages: any = []
	postNbCommentaires: number = 0
	postNbLikes: number = 0
	postLikesUsersListe: Array<any> = []											//Cette liste est affiché au hover des j'aimes; taille max = 9

	isMyPost: boolean = false

	constructor(private postsService: PostsService, private router: Router, private messagesService: MessagesService, private formBuilder: FormBuilder, private likesService: LikesService, private authService: AuthService) { }

	ngOnInit(): void {
		this.messages = []
		let localId: string = <string>sessionStorage.getItem('userId')
		if (parseInt(localId) == this.postUserId) {								//Si l'utilisateur est celui qui à créé le post, il peut le modifier ou le supprimer
			this.isMyPost = true
		}

		this.isAdmin()																		//Si l'utilisateur est Admin, il peut modifier ou supprimer le post
		this.postNbCommentaires = 0
		this.getMessages(this.postId)
		this.postNbLikes = 0
		this.postLikesUsersListe = []
		this.getLikes(this.postId)
		this.initForm()
	}

	isAdmin() {
		this.authService.isAdmin().then(												
			(isAdmin:boolean) => {
				if (isAdmin) {
					this.isMyPost = true
				}
			}
		)
	}

	initForm() {
		this.messageForm = this.formBuilder.group({
			newMessage: [null, Validators.required]
		})
	}

	onPostSetting(elem: HTMLElement) {
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

	onNewMessage() {
		const content = this.messageForm.get('newMessage')!.value
		const userId = sessionStorage.getItem('userId')

		if (content == null || content == undefined) {
			alert('Votre message est vide !')
		} else {
			this.messagesService.createNewMessage(this.postId, String(userId), content).then(() => {
				this.ngOnInit()
			})
		}
	}

	onDeleteMessage() {
		this.postNbCommentaires -= 1
	}

	getLikes(postId: number) {													// Renvoie les nom des personnes qui ont likés
		this.likesService.getLikes(postId).then(
			(res: any) => {
				for (let like of res.results) {
					this.postNbLikes += 1
					if (this.postLikesUsersListe.length < 9) {
						this.postLikesUsersListe.push(like)
					}
				}
				if (this.postLikesUsersListe.length >= 9) {				// La Liste de nom qui s'affiche ç une taille max de 9 nom
					this.postLikesUsersListe.push({ firstName: "...", lastName: "..." })
				}
			})
	}

	onLike() {
		this.likesService.createLike(this.postId).then((result) => {
			console.log('result is :', result)
			this.ngOnInit()
		}).catch((err) => {
			throw err
		});
	}

}
